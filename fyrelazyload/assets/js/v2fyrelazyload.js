(function($) {

    var pluginUrl = lazyLocation.pluginsUrl + '/fyrelazyload';
    
// FIRE ON WINDOW EVENT
  // $(window).on('DOMContentLoaded load resize scroll ajaxComplete', function(e) {
  //   ioImg(); 
  //   BackgroundLazyLoader();  
  // });  

// LAZY LOAD IMAGES

    function ioImg(){

        const images = document.querySelectorAll('img[data-src]');
        const config = {
            rootMargin: '50px 0px',
            threshold: 0.01,
        };

        let observer;

        if ('IntersectionObserver' in window) {
            observer = new IntersectionObserver(onChange, config);
            images.forEach(img => observer.observe(img));
        } else {
            console.log('%cIntersection Observers not supported', 'color: red');
            images.forEach(image => loadImage(image));
        } 

    }
    ioImg();

    const loadImage = image => {
        image.classList.add('fade-in');
        image.src = image.dataset.src;
    }

    function onChange(changes, observer) {
        changes.forEach(change => {
            if (change.intersectionRatio > 0) {
                // Stop watching and load the image
                loadImage(change.target);
                observer.unobserve(change.target);
            }
            
        });
    }

// LAZY LOAD BACKGROUND

    function BackgroundNode({node, loadedClassName}) {
        let src = node.getAttribute('data-background');
        let show = (onComplete) => {
            requestAnimationFrame(() => {
                node.style.backgroundImage = `url(${src})`
                node.classList.add(loadedClassName);
                onComplete();
            })
        }

        return {
            node,

            // onComplete is called after the image is done loading. 
            load: (onComplete) => {
                let img = new Image();
                img.onload = show(onComplete);
                img.src = src;
            }
        }
    }
    let defaultOptions = {
        selector: '[data-background]',
        loadedClassName: 'loaded'
    }

    function BackgroundLazyLoader({selector, loadedClassName} = defaultOptions) {
        let nodes = [].slice.apply(document.querySelectorAll(selector))
            .map(node => new BackgroundNode({node, loadedClassName}));

        let callback = (entries, observer) => {
            entries.forEach(({target, isIntersecting}) => {   
                if (!isIntersecting) {
                    return;
                }

                let obj = nodes.find(it => it.node.isSameNode(target));
                
                if (obj) {
                    obj.load(() => {
                        // Unobserve the node:
                        observer.unobserve(target);
                        // Remove this node from our list:
                        nodes = nodes.filter(n => !n.node.isSameNode(target));
                        
                        // If there are no remaining unloaded nodes,
                        // disconnect the observer since we don't need it anymore.
                        if (!nodes.length) {
                            observer.disconnect();
                        }
                    });
                }
            })
        };
        
        let observer = new IntersectionObserver(callback);
        nodes.forEach(node => observer.observe(node.node));
    };   

    BackgroundLazyLoader();

})(jQuery);