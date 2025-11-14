/**
 * Component Usage Test
 * This file demonstrates all UI components working together
 */

import { Button } from './Button'
import { Card } from './Card'
import { ProgressBar } from './ProgressBar'
import { Tag } from './Tag'

export default function TestComponents() {
  return (
    <div className="p-8 space-y-8">
      {/* Button Tests */}
      <section>
        <h2 className="text-xl font-bold mb-4">Buttons</h2>
        <div className="flex gap-4">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="primary" disabled>Disabled Button</Button>
        </div>
      </section>

      {/* Card Tests */}
      <section>
        <h2 className="text-xl font-bold mb-4">Cards</h2>
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <h3 className="font-semibold mb-2">Basic Card</h3>
            <p className="text-text-secondary">This is a basic card component</p>
          </Card>
          <Card hover>
            <h3 className="font-semibold mb-2">Hoverable Card</h3>
            <p className="text-text-secondary">Try hovering over me!</p>
          </Card>
        </div>
      </section>

      {/* ProgressBar Tests */}
      <section>
        <h2 className="text-xl font-bold mb-4">Progress Bars</h2>
        <div className="space-y-4">
          <ProgressBar current={3} total={10} />
          <ProgressBar current={7} total={10} />
          <ProgressBar current={10} total={10} />
        </div>
      </section>

      {/* Tag Tests */}
      <section>
        <h2 className="text-xl font-bold mb-4">Tags</h2>
        <div className="flex gap-2">
          <Tag>집중</Tag>
          <Tag>성장</Tag>
          <Tag>안정</Tag>
        </div>
      </section>
    </div>
  )
}
