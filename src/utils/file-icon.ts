import type { IconSvgName } from "~/components/ui/icon-svg"

const IMAGE_EXTENSIONS = new Set([
  "png",
  "jpg",
  "jpeg",
  "gif",
  "bmp",
  "tiff",
  "svg",
  "webp",
])

/**
 * Whether the file extension is a previewable image type.
 */
export function isImageExtension(ext: string): boolean {
  return IMAGE_EXTENSIONS.has(ext.toLowerCase())
}

/** Map file extension (lowercase, no dot) to MIME type for opening in external apps. */
const EXT_TO_MIME: Record<string, string> = {
  pdf: "application/pdf",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  csv: "text/csv",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  txt: "text/plain",
  zip: "application/zip",
  mp4: "video/mp4",
}

/**
 * Get MIME type for a file extension (for opening in external apps).
 * Returns "application/octet-stream" if unknown.
 */
export function getMimeTypeForExtension(ext: string): string {
  return EXT_TO_MIME[ext.toLowerCase()] ?? "application/octet-stream"
}

/**
 * Get the extension from a file name or URI (lowercase, no dot).
 */
export function getFileExtension(nameOrUri: string): string {
  const name = nameOrUri.includes("/")
    ? (nameOrUri.split("/").pop() ?? "")
    : nameOrUri
  const lastDot = name.lastIndexOf(".")
  if (lastDot === -1) return ""
  return name.slice(lastDot + 1).toLowerCase()
}

/**
 * Map file extension to DynamicIcon/IconSvg name for attachment display.
 * Uses the same logic as the design tip (FileImage, FileSpreadsheet, etc.)
 * mapped to MaterialCommunityIcons names.
 */
export function getFileIconForExtension(ext: string): IconSvgName {
  switch (ext) {
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "bmp":
    case "tiff":
    case "svg":
      return "photo-outline"
    case "xls":
    case "xlsx":
    case "ods":
    case "csv":
      return "file-outline"
    // case "doc":
    // case "docx":
    // case "odt":
    // case "txt":
    //   return "file-document"
    case "pdf":
      return "file-type-pdf-outline"
    case "zip":
    case "rar":
    case "7z":
    case "tar":
    case "gz":
      return "file-zip-outline"
    case "mov":
    case "avi":
    case "mp4":
    case "mpeg":
    case "wmv":
    case "mkv":
    case "webm":
    case "flv":
      return "video-outline"
    // case "ppt":
    // case "pptx":
    // case "odp":
    //   return "file-presentation-box"
    default:
      return "file-outline"
  }
}
