"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Minus, ShoppingCart, Receipt, Trash2, CreditCard, Banknote } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface MenuItem {
  id: number
  name: string
  price: number
  image: string
  category: string
}

interface CartItem extends MenuItem {
  quantity: number
}
// TODO interface
interface Order {
  id: string
  items: CartItem[]
  total: number
  paymentMethod: string
  timestamp: Date
  customerName?: string
  notes?: string
}

const menuItems: MenuItem[] = [
  { id: 1, name: "อกไก่ทอด", price: 30, image: "/placeholder.svg?height=150&width=150", category: "ไก่ทอด" },
  { id: 2, name: "น่องไก่ทอด", price: 20, image: "/placeholder.svg?height=150&width=150", category: "ไก่ทอด" },
  { id: 3, name: "ปีกไก่ทอด", price: 20, image: "/placeholder.svg?height=150&width=150", category: "ไก่ทอด" },
  { id: 4, name: "ข้าวเหนียว", price: 10, image: "/placeholder.svg?height=150&width=150", category: "ข้าวและของหวาน" },
  { id: 5, name: "น้ำพริกหนุ่ม", price: 10, image: "/placeholder.svg?height=150&width=150", category: "เครื่องเคียง" },
]

export default function ThaiPOSSystem() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
  const [showPayment, setShowPayment] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [customerName, setCustomerName] = useState("")
  const [notes, setNotes] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash")
  const [cashReceived, setCashReceived] = useState("")
  const { toast } = useToast()

  const addToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id)
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        )
      } else {
        return [...prevCart, { ...item, quantity: 1 }]
      }
    })
    toast({
      title: "เพิ่มในตะกร้า",
      description: `เพิ่ม ${item.name} แล้ว`,
    })
  }

  const removeFromCart = (itemId: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === itemId)
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map((cartItem) =>
          cartItem.id === itemId ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem,
        )
      } else {
        return prevCart.filter((cartItem) => cartItem.id !== itemId)
      }
    })
  }

  const clearCart = () => {
    setCart([])
    setCustomerName("")
    setNotes("")
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const processPayment = async () => {
    if (cart.length === 0) {
      toast({
        title: "ข้อผิดพลาด",
        description: "กรุณาเลือกสินค้าก่อนชำระเงิน",
        variant: "destructive",
      })
      return
    }

    const total = getTotalPrice()
    if (paymentMethod === "cash" && Number.parseFloat(cashReceived) < total) {
      toast({
        title: "ข้อผิดพลาด",
        description: "เงินสดที่รับไม่เพียงพอ",
        variant: "destructive",
      })
      return
    }

    const orderData = {
      items: [...cart],
      total,
      paymentMethod: paymentMethod === "cash" ? "เงินสด" : "บัตรเครดิต",
      customerName: customerName || undefined,
      notes: notes || undefined,
    }

    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const newOrder = await response.json();

    // Save payment data
    const paymentData = {
      order_id: newOrder.id,
      payment_method: paymentMethod === "cash" ? "เงินสด" : "บัตรเครดิต",
      amount_paid: total,
      change_amount: getChange(),
    };

    const paymentResponse = await fetch('/api/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    if (!paymentResponse.ok) {
      console.error("Failed to save payment:", await paymentResponse.text());
      toast({
        title: "ข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลการชำระเงินได้",
        variant: "destructive",
      });
      return;
    }

    const newOrderForState: Order = {
      ...orderData,
      id: newOrder.id,
      timestamp: new Date(),
    }

    setOrders((prev) => [newOrderForState, ...prev])
    setCurrentOrder(newOrderForState)
    setShowPayment(false)
    setShowReceipt(true)
    clearCart()
    setCashReceived("")

    toast({
      title: "ชำระเงินสำเร็จ",
      description: `ออเดอร์ ${newOrder.id} เสร็จสิ้น`,
    })
  }

  const getChange = () => {
    if (paymentMethod === "cash" && cashReceived) {
      return Number.parseFloat(cashReceived) - getTotalPrice()
    }
    return 0
  }

  return (
    <div className="min-h-screen bg-orange-50 p-4" style={{ width: "768px", height: "1024px", margin: "0 auto" }}>
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="bg-orange-600 text-white p-4 rounded-lg mb-4">
          <h1 className="text-2xl font-bold text-center">ระบบขายหน้าร้าน</h1>
          <p className="text-center text-orange-100">ร้านไก่ทอดไทย</p>
        </div>

        <div className="grid grid-cols-2 gap-4 h-[calc(100vh-120px)]">
          {/* Menu Section */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">เมนูอาหาร</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="grid grid-cols-1 gap-3">
                    {menuItems.map((item) => (
                      <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-3">
                          <div className="flex items-center space-x-3">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold text-sm">{item.name}</h3>
                              <p className="text-orange-600 font-bold">{item.price} บาท</p>
                              <Badge variant="secondary" className="text-xs">
                                {item.category}
                              </Badge>
                            </div>
                            <Button
                              onClick={() => addToCart(item)}
                              size="sm"
                              className="bg-orange-600 hover:bg-orange-700"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Cart Section */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>ตะกร้าสินค้า</span>
                  <Badge variant="secondary">
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    {getTotalItems()} รายการ
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {cart.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>ไม่มีสินค้าในตะกร้า</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{item.name}</h4>
                            <p className="text-orange-600 text-sm">{item.price} บาท</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={() => removeFromCart(item.id)}
                              size="sm"
                              variant="outline"
                              className="w-8 h-8 p-0"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button onClick={() => addToCart(item)} size="sm" variant="outline" className="w-8 h-8 p-0">
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="ml-3 text-right">
                            <p className="font-bold text-sm">{item.price * item.quantity} บาท</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>

                <Separator className="my-4" />

                {/* Customer Info */}
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="customerName" className="text-sm">
                      ชื่อลูกค้า (ไม่บังคับ)
                    </Label>
                    <Input
                      id="customerName"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="กรอกชื่อลูกค้า"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes" className="text-sm">
                      หมายเหตุ (ไม่บังคับ)
                    </Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="หมายเหตุเพิ่มเติม"
                      className="mt-1 h-16"
                    />
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Total */}
                <div className="space-y-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>รวมทั้งหมด:</span>
                    <span className="text-orange-600">{getTotalPrice()} บาท</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 mt-4">
                  <Button
                    onClick={clearCart}
                    variant="outline"
                    className="flex-1 bg-transparent"
                    disabled={cart.length === 0}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    ล้างตะกร้า
                  </Button>
                  <Dialog open={showPayment} onOpenChange={setShowPayment}>
                    <DialogTrigger asChild>
                      <Button className="flex-1 bg-green-600 hover:bg-green-700" disabled={cart.length === 0}>
                        <CreditCard className="w-4 h-4 mr-2" />
                        ชำระเงิน
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>ชำระเงิน</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between text-lg font-bold">
                            <span>ยอดรวม:</span>
                            <span className="text-orange-600">{getTotalPrice()} บาท</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label>วิธีการชำระเงิน</Label>
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => setPaymentMethod("cash")}
                              variant={paymentMethod === "cash" ? "default" : "outline"}
                              className="flex-1"
                            >
                              <Banknote className="w-4 h-4 mr-2" />
                              เงินสด
                            </Button>
                            <Button
                              onClick={() => setPaymentMethod("card")}
                              variant={paymentMethod === "card" ? "default" : "outline"}
                              className="flex-1"
                            >
                              <CreditCard className="w-4 h-4 mr-2" />
                              บัตรเครดิต
                            </Button>
                          </div>
                        </div>

                        {paymentMethod === "cash" && (
                          <div>
                            <Label htmlFor="cashReceived">เงินที่รับมา (บาท)</Label>
                            <Input
                              id="cashReceived"
                              type="number"
                              value={cashReceived}
                              onChange={(e) => setCashReceived(e.target.value)}
                              placeholder="กรอกจำนวนเงินที่รับมา"
                              className="mt-1"
                            />
                            {cashReceived && Number.parseFloat(cashReceived) >= getTotalPrice() && (
                              <p className="text-green-600 text-sm mt-1">เงินทอน: {getChange()} บาท</p>
                            )}
                          </div>
                        )}

                        <Button onClick={processPayment} className="w-full bg-green-600 hover:bg-green-700">
                          ยืนยันการชำระเงิน
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Receipt Dialog */}
        <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center">ใบเสร็จรับเงิน</DialogTitle>
            </DialogHeader>
            {currentOrder && (
              <div className="space-y-4">
                <div className="text-center border-b pb-4">
                  <h3 className="font-bold">ร้านไก่ทอดไทย</h3>
                  <p className="text-sm text-gray-600">เลขที่ออเดอร์: {currentOrder.id}</p>
                  <p className="text-sm text-gray-600">
                    วันที่: {currentOrder.timestamp.toLocaleDateString("th-TH")}{" "}
                    {currentOrder.timestamp.toLocaleTimeString("th-TH")}
                  </p>
                  {currentOrder.customerName && (
                    <p className="text-sm text-gray-600">ลูกค้า: {currentOrder.customerName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  {currentOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        {item.name} x{item.quantity}
                      </span>
                      <span>{item.price * item.quantity} บาท</span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>รวมทั้งหมด:</span>
                    <span>{currentOrder.total} บาท</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>วิธีชำระ:</span>
                    <span>{currentOrder.paymentMethod}</span>
                  </div>
                  {paymentMethod === "cash" && cashReceived && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span>เงินที่รับ:</span>
                        <span>{cashReceived} บาท</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>เงินทอน:</span>
                        <span>{getChange()} บาท</span>
                      </div>
                    </>
                  )}
                </div>

                {currentOrder.notes && (
                  <div className="text-sm">
                    <span className="font-medium">หมายเหตุ: </span>
                    <span>{currentOrder.notes}</span>
                  </div>
                )}

                <div className="text-center text-sm text-gray-600 border-t pt-4">
                  <p>ขอบคุณที่ใช้บริการ</p>
                  <p>โทร: 02-xxx-xxxx</p>
                </div>

                <Button onClick={() => setShowReceipt(false)} className="w-full">
                  <Receipt className="w-4 h-4 mr-2" />
                  ปิดใบเสร็จ
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
