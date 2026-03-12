import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateOrder } from '@/hooks/useOrders'
import { useToast } from '@/store/uiStore'
import PageWrapper from '@/components/layout/PageWrapper'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import FileUpload from '@/components/ui/FileUpload'
import { GARMENT_TYPES, DECORATION_METHODS, SHIPPING_METHODS } from '@/types'
import { MIN_ORDER_QUANTITY } from '@/lib/constants'

const orderSchema = z.object({
  garmentType: z.string().min(1, 'Select a garment type'),
  quantity: z.number().min(MIN_ORDER_QUANTITY, `Minimum order quantity is ${MIN_ORDER_QUANTITY}`),
  fabricType: z.string().optional(),
  fabricWeight: z.string().optional(),
  colorCodes: z.string().optional(),
  logoPlacement: z.string().optional(),
  decorationMethod: z.string().optional(),
  labelRequirements: z.string().optional(),
  shippingAddress: z.string().optional(),
  shippingMethod: z.string().optional(),
  specialNotes: z.string().optional(),
  timelineRequest: z.string().optional(),
})

type OrderFormData = z.infer<typeof orderSchema>

const STEPS = ['Garment Details', 'Design & Branding', 'Files', 'Shipping & Notes', 'Review & Submit']

export default function NewOrderPage() {
  const [step, setStep] = useState(0)
  const [files, setFiles] = useState<File[]>([])
  const navigate = useNavigate()
  const createOrder = useCreateOrder()
  const toast = useToast()

  const { register, handleSubmit, formState: { errors }, watch, trigger } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema) as never,
    defaultValues: {
      garmentType: '',
      quantity: MIN_ORDER_QUANTITY,
    },
  })

  const formValues = watch()

  const nextStep = async () => {
    const fieldsPerStep: (keyof OrderFormData)[][] = [
      ['garmentType', 'quantity', 'fabricType', 'fabricWeight'],
      ['colorCodes', 'logoPlacement', 'decorationMethod', 'labelRequirements'],
      [],
      ['shippingAddress', 'shippingMethod', 'specialNotes', 'timelineRequest'],
      [],
    ]
    const valid = await trigger(fieldsPerStep[step])
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  const prevStep = () => setStep((s) => Math.max(s - 1, 0))

  const onSubmit = async (data: OrderFormData) => {
    try {
      const order = await createOrder.mutateAsync(data)
      toast.success(`Order ${order.orderNumber} submitted!`)
      navigate(`/portal/orders/${order.id}`)
    } catch {
      toast.error('Failed to submit order')
    }
  }

  return (
    <PageWrapper title="New Order" subtitle="Fill in the details for your custom sportswear order">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <button
            key={s}
            onClick={() => i < step && setStep(i)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              i === step ? 'bg-forest text-white' : i < step ? 'bg-forest/20 text-emerald cursor-pointer' : 'bg-smoke/50 text-white/30'
            }`}
          >
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] border border-current">
              {i + 1}
            </span>
            {s}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Garment Details */}
        {step === 0 && (
          <Card>
            <h2 className="text-lg font-semibold text-white mb-6">Garment Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Garment Type *"
                options={GARMENT_TYPES.map((t) => ({ value: t, label: t }))}
                placeholder="Select type..."
                error={errors.garmentType?.message}
                {...register('garmentType')}
              />
              <Input
                label="Quantity *"
                type="number"
                min={MIN_ORDER_QUANTITY}
                error={errors.quantity?.message}
                {...register('quantity')}
              />
              <Input label="Fabric Type" placeholder="e.g. Polyester, Cotton blend" {...register('fabricType')} />
              <Input label="Fabric Weight" placeholder="e.g. 200 GSM" {...register('fabricWeight')} />
            </div>
          </Card>
        )}

        {/* Step 2: Design & Branding */}
        {step === 1 && (
          <Card>
            <h2 className="text-lg font-semibold text-white mb-6">Design & Branding</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Color Codes" placeholder="Pantone / HEX codes" {...register('colorCodes')} />
              <Input label="Logo Placement" placeholder="e.g. Center chest, left sleeve" {...register('logoPlacement')} />
              <Select
                label="Decoration Method"
                options={DECORATION_METHODS.map((m) => ({ value: m, label: m }))}
                placeholder="Select method..."
                {...register('decorationMethod')}
              />
              <Input label="Label Requirements" placeholder="Woven label, printed tag, etc." {...register('labelRequirements')} />
            </div>
          </Card>
        )}

        {/* Step 3: Files */}
        {step === 2 && (
          <Card>
            <h2 className="text-lg font-semibold text-white mb-6">Upload Files</h2>
            <p className="text-sm text-white/50 mb-4">Upload tech packs, design files, reference images, or logos.</p>
            <FileUpload
              onFiles={(newFiles) => setFiles((prev) => [...prev, ...newFiles])}
              accept=".pdf,.ai,.eps,.png,.jpg,.jpeg,.svg"
            />
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-smoke/30 rounded-xl">
                    <span className="text-sm text-white">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Step 4: Shipping & Notes */}
        {step === 3 && (
          <Card>
            <h2 className="text-lg font-semibold text-white mb-6">Shipping & Notes</h2>
            <div className="space-y-4">
              <Textarea label="Shipping Address" placeholder="Full delivery address" {...register('shippingAddress')} />
              <Select
                label="Shipping Method"
                options={SHIPPING_METHODS.map((m) => ({ value: m, label: m }))}
                placeholder="Select shipping..."
                {...register('shippingMethod')}
              />
              <Textarea label="Special Notes" placeholder="Any additional instructions or requirements" {...register('specialNotes')} />
              <Input label="Timeline Request" placeholder="e.g. Need by March 2026" {...register('timelineRequest')} />
            </div>
          </Card>
        )}

        {/* Step 5: Review */}
        {step === 4 && (
          <Card>
            <h2 className="text-lg font-semibold text-white mb-6">Review Your Order</h2>
            <dl className="space-y-3">
              {[
                ['Garment Type', formValues.garmentType],
                ['Quantity', formValues.quantity],
                ['Fabric Type', formValues.fabricType],
                ['Fabric Weight', formValues.fabricWeight],
                ['Color Codes', formValues.colorCodes],
                ['Logo Placement', formValues.logoPlacement],
                ['Decoration Method', formValues.decorationMethod],
                ['Label Requirements', formValues.labelRequirements],
                ['Shipping Method', formValues.shippingMethod],
                ['Timeline', formValues.timelineRequest],
                ['Files', files.length > 0 ? `${files.length} file(s)` : undefined],
              ].filter(([, v]) => v != null && v !== '').map(([label, value]) => (
                <div key={String(label)} className="flex justify-between py-2 border-b border-smoke/50">
                  <dt className="text-sm text-white/50">{label}</dt>
                  <dd className="text-sm text-white font-medium">{String(value)}</dd>
                </div>
              ))}
            </dl>
            {formValues.specialNotes && (
              <div className="mt-4">
                <p className="text-sm text-white/50 mb-1">Special Notes</p>
                <p className="text-sm text-white">{formValues.specialNotes}</p>
              </div>
            )}
            {formValues.shippingAddress && (
              <div className="mt-4">
                <p className="text-sm text-white/50 mb-1">Shipping Address</p>
                <p className="text-sm text-white">{formValues.shippingAddress}</p>
              </div>
            )}
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          {step > 0 ? (
            <Button type="button" variant="secondary" onClick={prevStep}>Back</Button>
          ) : (
            <div />
          )}
          {step < STEPS.length - 1 ? (
            <Button type="button" onClick={nextStep}>Continue</Button>
          ) : (
            <Button type="submit" loading={createOrder.isPending}>Submit Order</Button>
          )}
        </div>
      </form>
    </PageWrapper>
  )
}
