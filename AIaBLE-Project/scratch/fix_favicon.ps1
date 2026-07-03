[System.Reflection.Assembly]::LoadWithPartialName("System.Drawing") | Out-Null

$srcPath = "d:\CodingInspiration2026\AIaBLE-Project\frontend\src\app\icon.png"
$destPath1 = "d:\CodingInspiration2026\AIaBLE-Project\frontend\src\app\icon.png"
$destPath2 = "d:\CodingInspiration2026\AIaBLE-Project\frontend\public\favicon.png"
$destPath3 = "d:\CodingInspiration2026\AIaBLE-Project\frontend\public\favicon.ico"

# Read source image
$srcImg = New-Object System.Drawing.Bitmap($srcPath)
$w = [int]$srcImg.Width
$h = [int]$srcImg.Height

Write-Host "Processing image of size ${w}x${h}..."

# Create a new bitmap
$newImg = New-Object System.Drawing.Bitmap($w, $h)
$g = [System.Drawing.Graphics]::FromImage($newImg)

# Enable high quality rendering
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# 1. Fill entire background with the dark navy color (#0d0d2b)
$bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 13, 13, 43))
$g.FillRectangle($bgBrush, 0, 0, $w, $h)

# 2. Draw rounded rectangle clip path to clip the source image
# Shrink bounds slightly by 1.2% (about 12px for 1024x1024) to cleanly cut out all white anti-aliased edge pixels
$margin = [float]([Math]::Max(2, [Math]::Round($w * 0.012)))
$boundsW = [float]($w - 2 * $margin)
$boundsH = [float]($h - 2 * $margin)

$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$r = [float]($boundsW * 0.185) # Bán kính bo góc tương đối
$diameter = [float]($r * 2)

# Add rounded rect components to path
$path.AddArc($margin, $margin, $diameter, $diameter, 180, 90)
$path.AddArc(($margin + $boundsW - $diameter), $margin, $diameter, $diameter, 270, 90)
$path.AddArc(($margin + $boundsW - $diameter), ($margin + $boundsH - $diameter), $diameter, $diameter, 0, 90)
$path.AddArc($margin, ($margin + $boundsH - $diameter), $diameter, $diameter, 90, 90)
$path.CloseFigure()

# Set clip to the rounded path
$g.SetClip($path)

# Draw the source image inside the clipped area
# Using explicit RectangleF overload
$destRect = New-Object System.Drawing.RectangleF($margin, $margin, $boundsW, $boundsH)
$srcRect = New-Object System.Drawing.RectangleF(0, 0, [float]$w, [float]$h)
$g.DrawImage($srcImg, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

# Reset clip
$g.ResetClip()

# Clean up graphics context
$g.Dispose()
$srcImg.Dispose()

# Save output to all destinations
$newImg.Save($destPath1, [System.Drawing.Imaging.ImageFormat]::Png)
$newImg.Save($destPath2, [System.Drawing.Imaging.ImageFormat]::Png)

# For ICO, copy the png
Copy-Item -Path $destPath2 -Destination $destPath3 -Force

$newImg.Dispose()

Write-Host "Favicon fixed successfully. All white edges trimmed by 1.2% margin and filled with #0d0d2b."
