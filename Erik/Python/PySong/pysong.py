from PIL import Image, ImageFilter

width = 600
height = 500
im1 = Image.open("in.jpg") 

im2 = im1.filter(ImageFilter.GaussianBlur(radius=10)).filter(ImageFilter.SMOOTH)
im3 = im1.filter(ImageFilter.GaussianBlur(radius=10))

im1.save("out.gif", save_all=True, append_images=[im2, im3], duration=400, loop=0)
im2.save("test2.png")
im3.save("test3.png")