'use client'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { useDishListQuery } from '@/queries/useDish'
import { cn, formatCurrency, handleErrorApi } from '@/lib/utils'
import Quantity from '@/app/[locale]/guest/menu/quantity'
import { useMemo, useState } from 'react'
import { GuestCreateOrdersBodyType } from '@/schemaValidations/guest.schema'
import { useGuestOrderMutation } from '@/queries/useGuest'
import { DishCategory, DishStatus } from '@/constants/type'
import { useRouter } from '@/i18n/routing'
import { MessageSquare, Search } from 'lucide-react'

const CATEGORY_LABELS: Record<string, string> = {
  all: 'Tất cả',
  [DishCategory.Main]: 'Ăn chính',
  [DishCategory.Side]: 'Ăn phụ',
  [DishCategory.Drink]: 'Đồ uống'
}

export default function MenuOrder() {
  const { data } = useDishListQuery()
  const dishes = useMemo(() => data?.payload.data ?? [], [data])
  const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const { mutateAsync } = useGuestOrderMutation()
  const router = useRouter()

  const filteredDishes = useMemo(() => {
    return dishes
      .filter((dish) => dish.status !== DishStatus.Hidden)
      .filter((dish) => {
        const matchCategory =
          categoryFilter === 'all' ||
          (dish as { category?: string }).category === categoryFilter
        if (!matchCategory) return false
        const q = searchQuery.trim().toLowerCase()
        if (!q) return true
        return (
          dish.name.toLowerCase().includes(q) ||
          dish.description.toLowerCase().includes(q)
        )
      })
  }, [dishes, searchQuery, categoryFilter])

  const totalPrice = useMemo(() => {
    return dishes.reduce((result, dish) => {
      const order = orders.find((order) => order.dishId === dish.id)
      if (!order) return result
      return result + order.quantity * dish.price
    }, 0)
  }, [dishes, orders])

  const handleQuantityChange = (dishId: number, quantity: number) => {
    setOrders((prevOrders) => {
      if (quantity === 0) {
        return prevOrders.filter((order) => order.dishId !== dishId)
      }
      const index = prevOrders.findIndex((order) => order.dishId === dishId)
      if (index === -1) {
        return [...prevOrders, { dishId, quantity }]
      }
      const newOrders = [...prevOrders]
      newOrders[index] = { ...newOrders[index], quantity }
      return newOrders
    })
  }

  const handleNoteChange = (dishId: number, note: string | undefined) => {
    setOrders((prevOrders) => {
      const index = prevOrders.findIndex((order) => order.dishId === dishId)
      if (index === -1) return prevOrders
      const newOrders = [...prevOrders]
      newOrders[index] = { ...newOrders[index], note: note || undefined }
      return newOrders
    })
  }

  const handleOrder = async () => {
    try {
      await mutateAsync(orders)
      router.push(`/guest/orders`)
    } catch (error) {
      handleErrorApi({
        error
      })
    }
  }
  return (
    <>
      <div className='space-y-3'>
        <div className='relative'>
          <Search className='absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            placeholder='Tìm kiếm món...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-8'
          />
        </div>
        <div className='flex gap-1 overflow-x-auto pb-1'>
          {['all', DishCategory.Main, DishCategory.Side, DishCategory.Drink].map(
            (cat) => (
              <Button
                key={cat}
                variant={categoryFilter === cat ? 'default' : 'outline'}
                size='sm'
                className='shrink-0'
                onClick={() => setCategoryFilter(cat)}
              >
                {CATEGORY_LABELS[cat]}
              </Button>
            )
          )}
        </div>
      </div>
      {filteredDishes.map((dish) => {
        const order = orders.find((o) => o.dishId === dish.id)
        const quantity = order?.quantity ?? 0
        const note = order?.note ?? ''
        return (
          <div
            key={dish.id}
            className={cn('flex gap-4', {
              'pointer-events-none': dish.status === DishStatus.Unavailable
            })}
          >
            <div className='flex-shrink-0 relative'>
              {dish.status === DishStatus.Unavailable && (
                <span className='absolute inset-0 flex items-center justify-center text-sm'>
                  Hết hàng
                </span>
              )}
              <Image
                src={dish.image}
                alt={dish.name}
                height={100}
                width={100}
                quality={100}
                className='object-cover w-[80px] h-[80px] rounded-md'
              />
            </div>
            <div className='space-y-1 min-w-0 flex-1'>
              <h3 className='text-sm'>{dish.name}</h3>
              <p className='text-xs'>{dish.description}</p>
              <p className='text-xs font-semibold'>
                {formatCurrency(dish.price)}
              </p>
              {quantity > 0 && note && (
                <p className='text-xs text-muted-foreground truncate'>
                  Ghi chú: {note}
                </p>
              )}
            </div>
            <div className='flex-shrink-0 flex items-center gap-1'>
              <Quantity
                onChange={(value) => handleQuantityChange(dish.id, value)}
                value={quantity}
              />
              {quantity > 0 && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8'
                      title='Ghi chú cho món'
                    >
                      <MessageSquare
                        className={cn('h-4 w-4', note && 'text-primary')}
                      />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-72' align='end'>
                    <label className='text-sm font-medium'>Ghi chú cho món</label>
                    <Textarea
                      placeholder='Ví dụ: không hành, ít đá...'
                      value={note}
                      onChange={(e) =>
                        handleNoteChange(dish.id, e.target.value)
                      }
                      className='mt-2 min-h-[80px]'
                      maxLength={500}
                    />
                    <p className='text-xs text-muted-foreground mt-1'>
                      {note.length}/500
                    </p>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
        )
      })}
      <div className='sticky bottom-0'>
        <Button
          className='w-full justify-between'
          onClick={handleOrder}
          disabled={orders.length === 0}
        >
          <span>Đặt hàng · {orders.length} món</span>
          <span>{formatCurrency(totalPrice)}</span>
        </Button>
      </div>
    </>
  )
}
