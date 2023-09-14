const loader = document.querySelector('.loader-container');

const loaderToggle = (element, time) => {
  console.log('work');
  setTimeout(() => {
    const styles = [
      ['left', '-100vw'],
      ['transform', 'scale(0.8)'],
      ['transition', '.2s']
    ];

    styles.forEach(([property, value]) => {
      element.style[property] = value;
    });
  }, time);
};