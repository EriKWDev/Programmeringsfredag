
import string

text_file = open("Euler089.txt")
lines = text_file.read().split("\n")

def value_of_roman_letter(roman):
	if roman == "I":
		return 1
	elif roman == "V":
		return 5
	elif roman == "X":
		return 10
	elif roman == "L":
		return 50
	elif roman == "C":
		return 100
	elif roman == "D":
		return 500
	elif roman == "M":
		return 1000

def decimal_to_roman(num):
    val = [
        1000, 900, 500, 400,
        100, 90, 50, 40,
        10, 9, 5, 4,
        1
        ]
    syb = [
        "M", "CM", "D", "CD",
        "C", "XC", "L", "XL",
        "X", "IX", "V", "IV",
        "I"
        ]
    roman_num = ''
    i = 0
    while  num > 0:
        for _ in range(num // val[i]):
            roman_num += syb[i]
            num -= val[i]
        i += 1
    return roman_num

def roman_to_decimal(roman):
	n = 0
	for i in range(len(roman)):
		n += value_of_roman_letter(roman[i])

		if i + 1 < len(roman):
			subtractive_pair = False

			next_roman = roman[i + 1]
			if roman[i] == "I":
				if next_roman == "V" or next_roman == "X":
					n -= value_of_roman_letter("I")*2
					subtractive_pair = True
			elif roman[i] == "X":
				if next_roman == "L" or next_roman == "C":
					n -= value_of_roman_letter("X")*2
					subtractive_pair = True
			elif roman[i] == "C":
				if next_roman == "D" or next_roman == "M":
					n -= value_of_roman_letter("C")*2
					subtractive_pair = True

			if subtractive_pair == True:
				i += 1

	return n

def is_valid_roman(roman):
	return roman == decimal_to_roman(roman_to_decimal(roman))
