import React from "react";

import DrinkApp from "./components/DrinkApp";
import Footer from "./components/Footer";

class App extends React.Component {
	render() {
		return (
			<div>
				<DrinkApp />
				<Footer />
			</div>
		);
	}
}

export default App;
