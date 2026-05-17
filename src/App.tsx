import './App.css'
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BinderCreate from "./pages/BinderCreate";
import BinderView from "./pages/BinderView";

function App() {
	return (
		<main className="app">
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/BinderCreate" element={<BinderCreate />} />
				<Route path="/BinderView" element={<BinderView />} />
			</Routes>
		</main>
	)
}

export default App
