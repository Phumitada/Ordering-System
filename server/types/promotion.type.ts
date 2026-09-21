export interface CreatePromotionPayload {
  title: string
  description?: string
  badge_text?: string
  is_active?: boolean
}

export interface UpdatePromotionPayload {
  title?: string
  description?: string
  badge_text?: string
  is_active?: boolean
}
