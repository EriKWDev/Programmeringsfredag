import React from "react";

class Drink extends React.Component {
	render() {
		const drink = this.props.drink;

		return (
			<div className="drink">
				<h2>{drink.name}</h2>
				<p>{drink.ingredients}</p>
			</div>
		);
	}
}

export default Drink;
