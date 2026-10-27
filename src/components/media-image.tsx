import Image, { type ImageProps } from 'next/image'

import { mediaSrc } from '@/lib/queries'
import type { Media } from '@/payload-types'

type Props = Omit<ImageProps, 'src' | 'alt' | 'width' | 'height'> & {
  media: Media
  alt?: string
}

/** next/image for a Payload upload, with the editor's alt text and stored dimensions. */
export function MediaImage({ media, alt, ...props }: Props) {
  return (
    <Image
      src={mediaSrc(media)}
      alt={alt ?? media.alt}
      width={media.width ?? 1024}
      height={media.height ?? 1024}
      {...props}
    />
  )
}
