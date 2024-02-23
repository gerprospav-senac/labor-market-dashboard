document.addEventListener("DOMContentLoaded", function(event) {
  const website = document.getElementById('website-reference');
  const websiteValue = website?.value?.toLowerCase();
  const websiteOptions = Array.from(website?.options).map(item => item?.value);
  const websiteSession = sessionStorage.getItem('website-reference');
  if (websiteSession && websiteOptions.includes(websiteSession)) {
    website.value = websiteSession;
  } else {
    sessionStorage.setItem('website-reference', websiteValue);
  }

  const date = document.getElementById('date-reference');
  const dateValue = date?.value;
  const dateOptions = Array.from(date?.options).map(item => item?.value);
  const dateSession = sessionStorage.getItem('date-reference');
  if (dateSession && dateOptions.includes(dateSession)) {
    date.value = dateSession;
  } else {
    sessionStorage.setItem('date-reference', dateValue);
  }

  website.addEventListener('change', (event) => {
    sessionStorage.setItem('website-reference', event?.target?.value);
    document.dispatchEvent(new Event('onReferenceChange'));
  });

  date.addEventListener('change', (event) => {
    sessionStorage.setItem('date-reference', event?.target?.value);
    document.dispatchEvent(new Event('onReferenceChange'));
  });
});
