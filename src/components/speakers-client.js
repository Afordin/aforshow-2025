import { tzToCountry } from "../lib/tz-to-country.js";

const formatToDot = (date) => {
	const locale = navigator.language || "es-ES";
	const parts = new Intl.DateTimeFormat(locale, {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	}).formatToParts(date);

	const hour = parts.find((p) => p.type === "hour")?.value || "00";
	const minute = parts.find((p) => p.type === "minute")?.value || "00";
	return `${hour}.${minute}h`;
};

const getFlagUrl = (code) =>
	code ? `https://flagcdn.com/w20/${code.toLowerCase()}.png` : "";

const setFallback = (el) => {
	if (el) el.textContent = "🌐";
};

const insertFlagImg = (container, code) => {
	if (!container || !code) return setFallback(container);
	const url = getFlagUrl(code);
	if (!url) return setFallback(container);

	const img = document.createElement("img");
	img.src = url;
	img.srcset = `${url} 1x, https://flagcdn.com/w40/${code.toLowerCase()}.png 2x`;
	img.alt = code;
	img.width = 20;
	img.height = 14;
	img.loading = "lazy";
	img.decoding = "async";
	img.className = "flag-img";
	img.onerror = () => setFallback(container);
	container.replaceChildren(img);
};

const getCountryFromLocale = () => {
	const lang = navigator.language || "";
	const match = lang.match(/-([A-Z]{2})$/i);
	return match ? match[1].toUpperCase() : "";
};

const getCountryFromTimeZone = () => {
	const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
	return tzToCountry[tz] || "";
};

const resolveUserCountry = () => {
	return getCountryFromLocale() || getCountryFromTimeZone() || "";
};

const run = () => {
	// biome-ignore lint/complexity/noForEach: <explanation>
	document.querySelectorAll("li.talk-item").forEach((root) => {
		try {
			const tNode = root.querySelector("time.event-local-time[data-event-iso]");
			const flagContainer = root.querySelector(".event-flag");

			if (tNode?.dataset.eventIso) {
				const iso = tNode.dataset.eventIso;
				const d = new Date(iso);
				if (!Number.isNaN(d)) {
					tNode.setAttribute("datetime", iso);
					tNode.textContent = formatToDot(d);
				}
			}

			if (flagContainer) {
				const explicit = flagContainer.dataset.country?.trim();
				const country = explicit || resolveUserCountry();
				country
					? insertFlagImg(flagContainer, country)
					: setFallback(flagContainer);
			}
		} catch (err) {
			console.error("speakers-client error:", err);
		}
	});
};

const controller = new AbortController();
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", run, {
		signal: controller.signal,
	});
} else {
	run();
}
