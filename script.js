const datasContainer = document.querySelector('.datas');
const formAddress = document.querySelector('#form-address');
const input = formAddress.querySelector('input#ip-address');

const url = 'https://geo.ipify.org/api/v1?apiKey=at_FTygRXIuymwQ0gcgF8VEw36F5Wvll';

const myMap = L.map('map');

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: 'pk.eyJ1Ijoiam9hb2dhYnJpZWwtc2ciLCJhIjoiY2tqNHFxeTlqMm40cTJwbXl5dWljcHMzciJ9.lXGJFZJejlasEXBDkMFs8g'
}).addTo(myMap);

const pinIcon = L.icon({
  iconUrl: './images/pin.svg',
  iconSize: [48, 48],
  iconAnchor: [24, 48],
  popupAnchor: [0, 96]
});

const popup = L.popup({
  closeButton: false,
  className: 'map-popup',
  minWidth: 200,
  minHeight: 240
})

let marker;

const renderOnMap = ({ ip, isp, location: { lat, lng }}) => {
  myMap.setView([lat, lng], 15);  

  marker && myMap.removeLayer(marker);

  marker = L.marker([lat, lng], { icon: pinIcon })
    .addTo(myMap)
    .bindPopup(popup);

  popup.setContent(`<h1>${isp}</h1><span>${ip}</span>`);
}

const renderOnDatasBar = ({ 
  ip, isp, location: { city, country, postalCode, timezone }
}) => {
  const formatedPostalCode = postalCode ? ' ' + postalCode : '';
  const template = `
    <div class="data data-ip">
      <h1 class="data-title">Endereço de IP</h1>
      <p class="data-result">${ip}</p>
    </div>
    <div class="data data-location">
      <h1 class="data-title">Localização</h1>
      <p class="data-result">${city}, ${country}${formatedPostalCode}</p>
    </div>
    <div class="data data-timezone">
      <h1 class="data-title">Zona de Tempo</h1>
      <p class="data-result">UTC ${timezone}</p>
    </div>
    <div class="data data-isp">
      <h1 class="data-title">Provedor de Serviço de Internet</h1>
      <p class="data-result">${isp}</p>
    </div>
  `;
  datasContainer.innerHTML = template;
}

const searchForTheIpAddress = async (value) => {
  try {
    const endpoint = value ? `${url}&ipAddress=${value}` : url;
    const datas = await (await fetch(endpoint)).json();

    if (datas.code) throw new Error('Invalid IP Address!');
  
    const { ip, isp } = datas;

    if (ip && isp) {
      renderOnDatasBar(datas);
      renderOnMap(datas);
      return;
    }
  } catch (error) {
    input.classList.add('error');
    if (error) throw new Error(error);
  }
}

const handleFormSubmit = (e) => {
  e.preventDefault();
  
  if (input.value !== '' && Number(input.value[0]) !== 0) {
    searchForTheIpAddress(input.value);
    
    input.classList.remove('error');
    input.value = '';
    return;
  }
  
  input.classList.add('error');
  input.value = '';
}

formAddress.addEventListener('submit', handleFormSubmit);

searchForTheIpAddress();
