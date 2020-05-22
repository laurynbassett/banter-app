export default function genUUID() {
	// Source: https://www.w3resource.com/javascript-exercises/javascript-math-exercise-23.php
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
		let r = ((Math.random() * 16) % 16) | 0;
		return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
	});
}
