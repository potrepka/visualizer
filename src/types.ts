import type { FC } from 'react'

export type VisualizerComponent = FC

export interface VisualizerEntry {
  name: string
  component: VisualizerComponent
}
