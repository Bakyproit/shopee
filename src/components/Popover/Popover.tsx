import { FloatingArrow, FloatingPortal, Placement, arrow, offset, shift, useFloating } from '@floating-ui/react'
import React, { useRef, useState, useId, ElementType } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  children: React.ReactNode
  renderPopover: React.ReactNode
  className?: string
  as?: ElementType
  initalOpen?: boolean
  placement?: Placement
}

export default function Popover({
  children,
  renderPopover,
  className,
  as: Element = 'div',
  initalOpen,
  placement = 'bottom-end'
}: Props) {
  const [open, setOpen] = useState(initalOpen || false)
  const arrowRef = useRef(null)
  const { refs, context, x, y, strategy, middlewareData } = useFloating({
    middleware: [
      offset(6),
      shift(),
      arrow({
        element: arrowRef
      })
    ],
    placement: placement
  })
  const id = useId()
  const showPopover = () => {
    setOpen(true)
  }
  const hidePopover = () => {
    setOpen(false)
  }
  return (
    <Element className={className} ref={refs.setReference} onMouseEnter={showPopover} onMouseLeave={hidePopover}>
      {children}
      <AnimatePresence>
        {open && (
          <FloatingPortal id={id}>
            <motion.div
              ref={refs.setFloating}
              // style={floatingStyles}
              style={{
                position: strategy,
                left: x ?? 0,
                top: y ?? 0,
                width: 'max-content',
                transformOrigin: `${middlewareData.arrow?.x}px top`
              }}
              initial={{ opacity: 0, transform: 'scale(0)' }}
              animate={{ opacity: 1, transform: 'scale(1)' }}
              exit={{ opacity: 0, transform: 'scale(0)' }}
              transition={{ duration: 0.2 }}
            >
              <FloatingArrow ref={arrowRef} context={context} className='fill-white' />
              {renderPopover}
            </motion.div>
          </FloatingPortal>
        )}
      </AnimatePresence>
    </Element>
  )
}
