const sections = [...document.querySelectorAll("[data-scene]")];
const revealItems = [...document.querySelectorAll(".reveal")];
const navLinks = [...document.querySelectorAll("[data-nav]")];
const brand = document.querySelector(".brand");

const setActiveScene = (scene = "intro") => {
    document.body.dataset.scene = scene;
    if (brand) {
        brand.classList.toggle("is-hidden", scene !== "intro");
    }

    navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.dataset.nav === scene);
    });
};

const sceneObserver = new IntersectionObserver(
    (entries) => {
        const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;

        setActiveScene(visible.target.dataset.scene || "intro");
    },
    { threshold: [0.35, 0.55, 0.75] },
);

sections.forEach((section) => sceneObserver.observe(section));

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
            }
        });
    },
    { threshold: 0.18 },
);

revealItems.forEach((item) => revealObserver.observe(item));

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
        const href = anchor.getAttribute("href");
        const target = document.querySelector(href);
        if (!target) return;
        event.preventDefault();
        setActiveScene(target.dataset.scene || "intro");
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", href);
    });
});

window.addEventListener("pointermove", (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 18;
    const y = (event.clientY / window.innerHeight - 0.5) * 18;
    document.documentElement.style.setProperty("--mouse-x", `${x}px`);
    document.documentElement.style.setProperty("--mouse-y", `${y}px`);
});
