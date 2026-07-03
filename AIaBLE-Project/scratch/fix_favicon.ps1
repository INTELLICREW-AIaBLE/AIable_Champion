[System.Reflection.Assembly]::LoadWithPartialName("System.Drawing") | Out-Null

$srcPath = "d:\CodingInspiration2026\AIaBLE-Project\frontend\src\app\icon.png"
$destPath1 = "d:\CodingInspiration2026\AIaBLE-Project\frontend\src\app\icon.png"
$destPath2 = "d:\CodingInspiration2026\AIaBLE-Project\frontend\public\favicon.png"
$destPath3 = "d:\CodingInspiration2026\AIaBLE-Project\frontend\public\favicon.ico"

# Read source image
$srcImg = New-Object System.Drawing.Bitmap($srcPath)
$w = $srcImg.Width
$h = $srcImg.Height

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
# This will clip off any white corners on the source image
$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$r = [Math]::Min($w, $h) * 0.18 # Bán kính bo góc khoảng 18% kích thước
$bounds = New-Object System.Drawing.RectangleF(0, 0, $w, $h)

# Add rounded rect components to path
$path.AddArc($bounds.X, $bounds.Y, $r*2, $r*2, 180, 90)
$path.AddArc(($bounds.Right - $r*2), $bounds.Y, $r*2, $r*2, 270, 90)
$path.AddArc(($bounds.Right - $r*2), ($bounds.Bottom - $r*2), $r*2, $r*2, 0, 90)
$path.AddArc($bounds.X, ($bounds.Bottom - $r*2), $r*2, $r*2, 90, 90)
$path.CloseFigure()

# Set clip to the rounded path
$g.SetClip($path)

# Draw the source image inside the clipped area
$g.DrawImage($srcImg, 0, 0, $w, $h)

# Reset clip
$g.ResetClip()

# Clean up graphics context
$g.Dispose()
$srcImg.Dispose()

# Save output to all destinations
$newImg.Save($destPath1, [System.Drawing.Imaging.ImageFormat]::Png)
$newImg.Save($destPath2, [System.Drawing.Imaging.ImageFormat]::Png)

# For ICO, we can just save it as PNG format (modern browsers fully support PNG inside .ico or simple rename, but to be clean we copy the png to ico)
Copy-Item -Path $destPath2 -Destination $destPath3 -Force

$newImg.Dispose()

Write-Host "Favicon fixed successfully. 4 corners are now filled with dark color (#0d0d2b)."
