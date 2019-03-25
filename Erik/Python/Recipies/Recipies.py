import pickle

class Recipe:
	def __init__(self, name, ingredients, amounts, instructions, tags):
		self.name = name;
		self.ingredients = ingredients or ["Mix all ingredients", "Enjoy"];
		self.amounts = amounts
		self.instructions = instructions;
		self.tags = tags;

	def print_self(self):
		self.print_recipe(self)

	def print_recipe(self, recipe):
		s = ""
		for i in range(len(recipe.name)):
			s += "-"
		print("")
		print(s)
		print(recipe.name)
		print(s)
		print("\nIngredients:")
		for i in range(len(recipe.ingredients)):
			print("{} {}".format(recipe.amounts[i], recipe.ingredients[i]))

		print("\nInstructions:")
		for i in range(len(recipe.instructions)):
			print("{}. {}".format(i+1, recipe.instructions[i]))

		print("\nTags: {}\n".format(", ".join(recipe.tags)))


def main():
	new_recipe = Recipe(
		name="Gin & Tonic",
		ingredients=["Gin", "Tonic"],
		amounts=["1 Part", "3 Parts"],
		instructions=[
			"Pour 1 Part Gin into a tall glass with some ice (optional)",
			"Pour 3 Parts Tonic into the glass and stir gently",
			"Enjoy"
		],
		tags=["Drink", "GT", "Gin & Tonic", "Gin", "Tonic", "Simple", "Cocktail"],
	)

	# recipies = {1:new_recipe}
	pickle_in = open("recipies.pkl", "rb")
	recipies = pickle.load(pickle_in)
	for i in recipies:
		recipies[i].print_self()

	# pickle_out = open("recipies.pkl", "wb")
	# pickle.dump(recipies, pickle_out)
	# pickle_out.close()

if __name__ == "__main__":
	main()
