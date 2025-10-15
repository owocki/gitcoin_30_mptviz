# Gallery Preview Images

Place your preview images in this folder to display them in the gallery.

## How to Add Images

1. Save your preview image file in this folder (e.g., `climate-change.jpg`)
2. Update `src/config/gallery.json` and reference it as `/img/your-filename.jpg`

## Image Recommendations

- **Format**: JPG or PNG
- **Dimensions**: 1200x900px or similar 4:3 ratio works well
- **File Size**: Keep under 500KB for faster loading
- **Naming**: Use descriptive kebab-case names (e.g., `climate-change.jpg`, `ethereum-augmented.jpg`)

## Example

```json
{
  "id": "climate1",
  "title": "Climate Change Visualization",
  "previewUrl": "/img/climate-change.jpg",
  "fullUrl": "/#create?config=..."
}
```
