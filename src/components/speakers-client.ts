import { tzToCountry } from "../lib/tz-to-country";

const formatToDot = (date: Date) => {
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

const getFlagEmoji = (countryCode?: string | null) => {
	if (!countryCode) return "🌐";
  const codePoints = [...countryCode.toUpperCase()].map(x => 0x1F1A5 + x.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

const getCountryFromLocale = () => {
	const lang = navigator.language || "";
	const match = lang.match(/-([A-Z]{2})$/i);
	return match ? match[1] : "";
};

const getCountryFromTimeZone = () => {
	const tz = Intl.DateTimeFormat().resolvedOptions().timeZone as keyof typeof tzToCountry;
	return tzToCountry[tz] || "";
};

const resolveUserCountry = () => {
	return getCountryFromTimeZone() || getCountryFromLocale() || "";
};

const run = () => {
	const userCountry = resolveUserCountry();
	// biome-ignore lint/complexity/noForEach: <explanation>
	document.querySelectorAll<HTMLLIElement>("li.talk-item").forEach((root) => {
		try {
			const tNode = root.querySelector<HTMLTimeElement>("time.event-local-time[datetime]");
			const flagContainer = root.querySelector<HTMLDivElement>(".event-flag");

			if (tNode?.dateTime) {
				const date = new Date(tNode.dateTime);
				if (!Number.isNaN(date)) {
					tNode.textContent = formatToDot(date);
				}
			}

			if (flagContainer) {
				const explicit = flagContainer.dataset.country?.trim();
				const country = explicit || userCountry;
				flagContainer.textContent = getFlagEmoji(country);
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
