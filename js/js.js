document.querySelectorAll(".MainTree li").forEach(function (it, ind) {
    Array.prototype.slice.call(it.childNodes).forEach(function (item, index) {
        if (item?.localName == "ul") {
            it.classList.add('parent_li');
            it.querySelector('span').setAttribute("title", "Zwiń tę gałąź");
        }
    });
})



document.querySelectorAll('.MainTree li.parent_li > span').forEach(function (item, index) {
    item.addEventListener('click', function (e) {
        var childrens = document.querySelectorAll(getDomPath(item).join(" > ").split("span")[0] + ' ul li');
        childrens.forEach(function (it, ind) {
            if (it.getAttribute("hidden") == null) {
                it.style.display = "none";
                it.setAttribute("hidden", "true");
                item.setAttribute("title", "Rozwiń tę gałąź");
                if (!document.querySelector(getDomPath(item).join(" > ") + ' i').classList.contains("fa-folder-open")) {
                    document.querySelector(getDomPath(item).join(" > ") + ' i').classList.remove('fa-minus-square');
                    document.querySelector(getDomPath(item).join(" > ") + ' i').classList.add('fa-plus-square');
                }
            } else {
                it.style.display = "list-item";
                it.removeAttribute("hidden");
                item.setAttribute("title", "Zwiń tę gałąź");
                if (!document.querySelector(getDomPath(item).join(" > ") + ' i').classList.contains("fa-folder-open")) {
                    document.querySelector(getDomPath(item).join(" > ") + ' i').classList.remove('fa-plus-square');
                    document.querySelector(getDomPath(item).join(" > ") + ' i').classList.add('fa-minus-square');
                }
            }
        })
        e.stopPropagation();
    });
});

function getDomPath(el) {
    var stack = [];
    while (el.parentNode != null) {
        var sibCount = 0;
        var sibIndex = 0;
        for (var i = 0; i < el.parentNode.childNodes.length; i++) {
            var sib = el.parentNode.childNodes[i];
            if (sib.nodeName == el.nodeName) {
                if (sib === el) {
                    sibIndex = sibCount;
                }
                sibCount++;
            }
        }
        if (el.hasAttribute('id') && el.id != '') {
            stack.unshift(el.nodeName.toLowerCase() + '#' + el.id);
        } else if (sibCount > 1) {
            stack.unshift(el.nodeName.toLowerCase() + ':nth-child(' + (sibIndex + 1) + ')');
        } else {
            stack.unshift(el.nodeName.toLowerCase());
        }
        el = el.parentNode;
    }

    return stack.slice(1);
}