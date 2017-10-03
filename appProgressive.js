function resize() {
    if (window.innerWidth >= 1250){
        document.getElementByTagName("textarea").setAttribute("cols", "95");
    }
    else if (window.innerWidth >= 700 && window.innerWidth < 1250){
        document.getElementByTagName("textarea").setAttribute("cols", "70");
    }
    else {
        document.getElementByTagName("textarea").setAttribute("cols", "35");
    }
    
}