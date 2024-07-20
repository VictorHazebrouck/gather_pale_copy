//@ts-nocheck

function Component(Alpine) {
    Alpine.directive("component", async (el, { expression, modifiers }, { evaluate }) => {
        const componentPath = evaluate(expression);

        const response = await fetch(`/ui/${componentPath}.html`);
        const data = await response.text();
        //console.log("Data: ", el);

        if (modifiers.includes("outer")) {
            el.outerHTML = data;
            return;
        }

        if (modifiers.includes("inner")) {
            el.innerHTML = data;
            return;
        }

        el.innerHTML = data;
        return;
    });
}

export { Component };
