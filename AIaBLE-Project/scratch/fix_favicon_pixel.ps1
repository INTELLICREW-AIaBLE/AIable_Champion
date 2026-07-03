[System.Reflection.Assembly]::LoadWithPartialName("System.Drawing") | Out-Null

$srcPath = "C:\Users\quoca\.gemini\antigravity-ide\brain\10031b58-7ec9-4c7d-a320-1ce479ded4b1\aiable_icon_favicon_1783053676067.png"
$destPath1 = "d:\CodingInspiration2026\AIaBLE-Project\frontend\src\app\icon.png"
$destPath2 = "d:\CodingInspiration2026\AIaBLE-Project\frontend\public\favicon.png"
$destPath3 = "d:\CodingInspiration2026\AIaBLE-Project\frontend\public\favicon.ico"

# Read source image
$bmp = New-Object System.Drawing.Bitmap($srcPath)
$w = $bmp.Width
$h = $bmp.Height

Write-Host "Analyzing and cleaning pixels for image of size ${w}x${h}..."

# Target dark background color (#0d0d2b)
$darkColor = [System.Drawing.Color]::FromArgb(255, 13, 13, 43)

# Define corner threshold: 22% of the image size
$cornerSize = [int]($w * 0.22)

# We will scan the 4 corner squares of the image
# If a pixel in these corner regions is brighter than the dark background, we force it to be the dark background.
# This completely eliminates any white corner artifacts or borders.

# Helper function to check and set pixel color
function Clean-Pixel($x, $y) {
    $pixel = $bmp.GetPixel($x, $y)
    
    # Check if the pixel color is bright (indicating a white border or corner)
    # The dark background (#0d0d2b) has R=13, G=13, B=43.
    # Anything with R > 30, G > 30 or B > 50 in the corners is considered part of the white corner artifact.
    if ($pixel.R -gt 25 -or $pixel.G -gt 25 -or $pixel.B -gt 45) {
        $bmp.SetPixel($x, $y, $darkColor)
    }
}

# Top-Left Corner
for ($x = 0; $x -lt $cornerSize; $x++) {
    for ($y = 0; $y -lt $cornerSize; $y++) {
        Clean-Pixel $x $y
    }
}

# Top-Right Corner
for ($x = ($w - $cornerSize); $x -lt $w; $x++) {
    for ($y = 0; $y -lt $cornerSize; $y++) {
        Clean-Pixel $x $y
    }
}

# Bottom-Left Corner
for ($x = 0; $x -lt $cornerSize; $x++) {
    for ($y = ($h - $cornerSize); $y -lt $h; $y++) {
        Clean-Pixel $x $y
    }
}

# Bottom-Right Corner
for ($x = ($w - $cornerSize); $x -lt $w; $x++) {
    for ($y = ($h - $cornerSize); $y -lt $h; $y++) {
        Clean-Pixel $x $y
    }
}

# Save output to all destinations
$bmp.Save($destPath1, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Save($destPath2, [System.Drawing.Imaging.ImageFormat]::Png)

$bmp.Dispose()

# For ICO, copy the png
Copy-Item -Path $destPath2 -Destination $destPath3 -Force

Write-Host "Favicon fixed successfully. All bright pixels in the 4 corners have been replaced with solid #0d0d2b."
