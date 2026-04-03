'use client'

import Image from 'next/image'
import { Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useOrder, fieldIds, type OrderFormInstanceId, ORDER_FORM_PRIMARY_ID } from './order-context'
import { productsCatalog } from './products-catalog'
import { cn } from '@/lib/utils'

const SECTION_IDS: Record<OrderFormInstanceId, string> = {
  primary: ORDER_FORM_PRIMARY_ID,
  secondary: 'order-form-secondary',
}

export function OrderFormSection({ instanceId }: { instanceId: OrderFormInstanceId }) {
  const tOrder = useTranslations('order')
  const tProducts = useTranslations('products')
  const ids = fieldIds(instanceId)
  const {
    formData,
    chosenProductId,
    isSubmitted,
    isSubmitting,
    fieldErrors,
    handleInputChange,
    selectProduct,
    handleSubmit,
    finalProduct,
    isProductPreselected,
    productFromContext,
  } = useOrder()

  const productLabel = (id: string) => tProducts(`items.${id}.name`)
  const headingId = `order-form-heading-${instanceId}`

  return (
    <section
      id={SECTION_IDS[instanceId]}
      className="scroll-mt-24 border-y border-border/60 bg-muted/30 py-12 md:py-16"
      aria-labelledby={headingId}
    >
      <div className="mx-auto max-w-md px-4">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
          <h2 id={headingId} className="text-2xl font-bold text-foreground">
            {isSubmitted ? tOrder('titleThanks') : tOrder('title')}
          </h2>

          {!isSubmitted ? (
            <>
              <form
                onSubmit={(e) => handleSubmit(e, instanceId)}
                className="mt-8 space-y-4"
              >
                <div>
                  <p className="mb-3 text-sm font-semibold text-foreground" id={`${ids.produit}-legend`}>
                    {tOrder('product')} *
                  </p>
                  {isProductPreselected && productFromContext ? (
                    <div className="overflow-hidden rounded-xl border-2 border-primary bg-primary/5">
                      <div className="relative aspect-[16/10] w-full bg-muted">
                        <Image
                          src={productFromContext.image}
                          alt={productLabel(productFromContext.id)}
                          fill
                          className="object-cover"
                          sizes="(max-width: 448px) 100vw, 448px"
                        />
                      </div>
                      <div className="p-4">
                        <p className="font-bold text-foreground">{productLabel(productFromContext.id)}</p>
                        <p className="mt-1 text-lg font-semibold text-primary">
                          {tOrder('price', { price: productFromContext.price })}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div
                        id={ids.produit}
                        role="group"
                        aria-labelledby={`${ids.produit}-legend`}
                        aria-invalid={Boolean(fieldErrors.product)}
                        aria-describedby={fieldErrors.product ? `${ids.produit}-error` : undefined}
                        tabIndex={-1}
                        className={cn(
                          'grid gap-3 rounded-xl p-1 outline-none',
                          fieldErrors.product && 'ring-2 ring-red-500 ring-offset-2 ring-offset-background'
                        )}
                      >
                        {productsCatalog.map((p) => {
                          const selected = chosenProductId === p.id
                          return (
                            <button
                              key={p.id}
                              type="button"
                              aria-pressed={selected}
                              aria-label={`${productLabel(p.id)} — ${p.price} DT`}
                              onClick={() => selectProduct(p.id)}
                              className={cn(
                                'flex w-full overflow-hidden rounded-xl border-2 bg-card text-left transition-all hover:border-primary/60 hover:shadow-md',
                                selected
                                  ? 'border-primary shadow-md ring-2 ring-primary/30'
                                  : 'border-border'
                              )}
                            >
                              <div className="relative h-24 w-28 shrink-0 bg-muted sm:h-28 sm:w-32">
                                <Image
                                  src={p.image}
                                  alt=""
                                  fill
                                  className="object-cover"
                                  sizes="128px"
                                />
                              </div>
                              <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 p-3 pr-10 sm:p-4">
                                <span className="font-semibold leading-tight text-foreground">
                                  {productLabel(p.id)}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {p.price} DT
                                  {p.oldPrice ? (
                                    <span className="ml-2 line-through opacity-70">{p.oldPrice} DT</span>
                                  ) : null}
                                </span>
                              </div>
                              <div
                                className={cn(
                                  'flex w-10 shrink-0 items-center justify-center border-l border-border bg-muted/40',
                                  selected && 'bg-primary/10'
                                )}
                              >
                                {selected ? (
                                  <Check className="h-6 w-6 text-primary" aria-hidden />
                                ) : (
                                  <span className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                                )}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                      {fieldErrors.product ? (
                        <p id={`${ids.produit}-error`} role="alert" className="mt-2 text-sm text-red-600">
                          {fieldErrors.product}
                        </p>
                      ) : null}
                    </>
                  )}
                </div>

                <div>
                  <label htmlFor={ids.nom} className="mb-2 block text-sm font-semibold text-foreground">
                    {tOrder('name')} *
                  </label>
                  <input
                    id={ids.nom}
                    type="text"
                    name="nom"
                    placeholder={tOrder('namePh')}
                    value={formData.nom}
                    onChange={handleInputChange}
                    autoComplete="name"
                    aria-invalid={Boolean(fieldErrors.nom)}
                    aria-describedby={fieldErrors.nom ? `${ids.nom}-error` : undefined}
                    className={cn(
                      'w-full rounded-lg border-2 bg-background px-4 py-3 text-foreground transition-colors focus:outline-none',
                      fieldErrors.nom
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-border focus:border-primary'
                    )}
                  />
                  {fieldErrors.nom ? (
                    <p id={`${ids.nom}-error`} role="alert" className="mt-1.5 text-sm text-red-600">
                      {fieldErrors.nom}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor={ids.tel} className="mb-2 block text-sm font-semibold text-foreground">
                    {tOrder('phone')} *
                  </label>
                  <input
                    id={ids.tel}
                    type="tel"
                    name="telephone"
                    placeholder={tOrder('phonePh')}
                    value={formData.telephone}
                    onChange={handleInputChange}
                    autoComplete="tel"
                    inputMode="tel"
                    aria-invalid={Boolean(fieldErrors.telephone)}
                    aria-describedby={fieldErrors.telephone ? `${ids.tel}-error` : undefined}
                    className={cn(
                      'w-full rounded-lg border-2 bg-background px-4 py-3 text-foreground transition-colors focus:outline-none',
                      fieldErrors.telephone
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-border focus:border-primary'
                    )}
                  />
                  {fieldErrors.telephone ? (
                    <p id={`${ids.tel}-error`} role="alert" className="mt-1.5 text-sm text-red-600">
                      {fieldErrors.telephone}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor={ids.adresse} className="mb-2 block text-sm font-semibold text-foreground">
                    {tOrder('address')} *
                  </label>
                  <input
                    id={ids.adresse}
                    type="text"
                    name="adresse"
                    placeholder={tOrder('addressPh')}
                    value={formData.adresse}
                    onChange={handleInputChange}
                    autoComplete="street-address"
                    aria-invalid={Boolean(fieldErrors.adresse)}
                    aria-describedby={fieldErrors.adresse ? `${ids.adresse}-error` : undefined}
                    className={cn(
                      'w-full rounded-lg border-2 bg-background px-4 py-3 text-foreground transition-colors focus:outline-none',
                      fieldErrors.adresse
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-border focus:border-primary'
                    )}
                  />
                  {fieldErrors.adresse ? (
                    <p id={`${ids.adresse}-error`} role="alert" className="mt-1.5 text-sm text-red-600">
                      {fieldErrors.adresse}
                    </p>
                  ) : null}
                </div>

                {fieldErrors.form ? (
                  <p id={`${instanceId}-form-error`} role="alert" className="mt-4 text-sm text-red-600">
                    {fieldErrors.form}
                  </p>
                ) : null}

                <div className="mt-6 flex justify-center">
                  <span className="inline-flex items-center rounded-full border border-amber-300/80 bg-amber-50 px-4 py-1.5 text-sm font-semibold text-amber-950 shadow-sm dark:border-amber-700/60 dark:bg-amber-950/40 dark:text-amber-100">
                    {tOrder('submitUrgencyBadge')}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-3 w-full transform rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 py-4 font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-orange-600 hover:to-orange-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:transform-none"
                >
                  {isSubmitting ? tOrder('submitting') : tOrder('submit')}
                </button>
                <p className="mt-3 text-center text-sm text-muted-foreground">
                  {tOrder('submitDeliveryNote')}
                </p>
              </form>
            </>
          ) : (
            <div className="py-8 text-center">
              <div className="mb-4 text-5xl">✅</div>
              <h3 className="mb-4 text-2xl font-bold text-foreground">{tOrder('successTitle')}</h3>
              <p className="mb-2 text-muted-foreground">{tOrder('successBody')}</p>
              <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
                <p className="mb-2 font-semibold text-green-800">{tOrder('successPay1')}</p>
                <p className="font-semibold text-green-800">{tOrder('successPay2')}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
