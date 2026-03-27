import urllib.request
import re

req = urllib.request.Request(
    "https://motionbgs.com/gojo-vs-sukuna",
    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
)
try:
    with urllib.request.urlopen(req) as response:
        content = response.read().decode('utf-8', errors='ignore')
        
    mp4_matches = re.finditer(r'(.{0,30}\.mp4.{0,30})', content)
    print("MP4 mentions:")
    for m in mp4_matches:
        print(m.group(1).strip())
        
except Exception as e:
    print("Error:", e)
    
    if not url.startswith('http'):
        if url.startswith('/'):
            url = 'https://motionbgs.com' + url
        else:
            url = 'https://motionbgs.com/' + url
            
    print("Downloading:", url)
    out_path = r"c:\Users\krish\OneDrive\Desktop\Projects\moodify\public\video-bg.mp4"
    urllib.request.urlretrieve(url, out_path)
    print("Downloaded successfully to", out_path)
else:
    # If no .mp4 found directly, let's look for download link
    # Download link goes to <a href="/download/gojo-vs-sukuna/4k"> or something
    dls = re.findall(r'href=[\'"](/download/[^\'"]+)[\'"]', content)
    print("Download links found:", dls)
    if dls:
        print("You might need to hit the download link to get the redirect to mp4.")
    else:
        print("No mp4 urls or download links found")
