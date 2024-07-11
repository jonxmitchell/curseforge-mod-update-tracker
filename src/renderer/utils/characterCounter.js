function setupCharacterCounter(inputId, counterId, maxLength) {
	const input = document.getElementById(inputId);
	const counter = document.getElementById(counterId);

	function updateCounter() {
		const currentLength = input.value.length;
		counter.textContent = `${currentLength}/${maxLength}`;

		const percentage = (currentLength / maxLength) * 100;
		if (percentage >= 100) {
			counter.classList.remove("text-amber-500");
			counter.classList.add("text-red-500");
		} else if (percentage >= 90) {
			counter.classList.remove(
				"text-gray-500",
				"dark:text-gray-400",
				"text-red-500"
			);
			counter.classList.add("text-amber-500");
		} else {
			counter.classList.remove("text-amber-500", "text-red-500");
			counter.classList.add("text-gray-500", "dark:text-gray-400");
		}
	}

	input.addEventListener("input", updateCounter);
	updateCounter(); // Initial count
}

function initializeCharacterCounters() {
	setupCharacterCounter("webhookText", "webhookTextCounter", 2000);
	setupCharacterCounter("embedTitle", "embedTitleCounter", 256);
	setupCharacterCounter("embedText", "embedTextCounter", 4096);
	setupCharacterCounter("footerText", "footerTextCounter", 2048);
	setupCharacterCounter("authorName", "authorNameCounter", 256);
}

module.exports = {
	initializeCharacterCounters,
};
