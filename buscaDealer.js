var map;
var markerObjs = [];
var map;
var markers = [];
var tbl_row = "";
var autocomplete;

var buscaDealerDOM = {
  areaBusca:"",
  areaResultado:"",
  campoIDDealer:""
}


var icons = {
  dealer: {
    icon: '/apps/hmb/components/content/mapa-geo/clientlib/svg/icone-pin.svg'
  },
  service: {
    icon: '/apps/hmb/components/content/mapa-geo/clientlib/svg/icone-pin.svg'
  },
  active: {
    icon: '/apps/hmb/components/content/mapa-geo/clientlib/svg/icone-pin-active.svg'
  }
};

function ativarAutoCompleteMonteoSeu() {
  $("#"+buscaDealerDOM.areaBusca+" .dealerResults").html("");
  $("#"+buscaDealerDOM.areaBusca+"_queryDealerMOS").off("keyup");
  $("#"+buscaDealerDOM.areaBusca+"_queryDealerMOS").val("");
  var card = document.getElementById('pac-cardMOS');
  var input = document.getElementById(buscaDealerDOM.areaBusca+'_queryDealerMOS');
  var strictBounds = document.getElementById('strict-bounds-selector');
  // var types = document.getElementById('type-selector');

  var defaultBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(-34.0891, -73.9828169),
    new google.maps.LatLng(5.2717863, -28.650543));

  var options = {
    //strictBounds: true,
    types: ['(cities)'],
    geocode: true,
    bounds: defaultBounds,
    //types: ['geocodes']
  };

  autocomplete = new google.maps.places.Autocomplete(input, options);
  autocomplete.setFields(
    ['address_components', 'geometry', 'icon', 'name']);

  autocomplete.addListener('place_changed', function() {
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[1] && place.address_components[2].short_name || '')
      ].join(' ');
    }

    buscaDealer("", true, place.geometry.location.lat(), place.geometry.location.lng())

  });
  autocomplete.setOptions({
    geocode: true
  });
}

function desativarAutoCompleteMonteoSeu() {
  $("#"+buscaDealerDOM.areaBusca+" .dealerResults").html("");
  $("#"+buscaDealerDOM.areaBusca+"_queryDealerMOS").val("");
  google.maps.event.clearInstanceListeners($("#"+buscaDealerDOM.areaBusca+"_queryDealerMOS")[0]);
}

function getLocationMOS(obj) {
  if (obj.checked) {
    if (navigator.geolocation) {
      $(".queryDealer").val("");
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      geolocation.innerHTML = "Seu browser não suporta Geolocalização.";
    }
  } else {
    $("#"+buscaDealerDOM.areaBusca+" .dealerResults").html("");
  }
}

function inputPress(obj, e) {
  if (e.which == 10 || e.which == 13) {
    buscaQuery();
  }
}

function showPosition(position) {
  buscaDealer("", true, position.coords.latitude, position.coords.longitude)
}

function buscaQuery() {
  if ($("#"+buscaDealerDOM.areaBusca+"_queryDealerMOS").val() != "") {
    buscaDealer($("#"+buscaDealerDOM.areaBusca+"_queryDealerMOS").val(), false, null, null)
  }
}

function makeHTML(dealer) {

  tbl_row += "<li id='dealer-" + dealer.csn + "'>";
  tbl_row += "<div class='dealerName pin'>" + dealer.nickName + "</div>";
  tbl_row += "<div class='telefone_end'>";
  if (dealer.mainPhone) tbl_row += "Vendas: <span>" + dealer.mainPhone + "</span><br />";
  if (dealer.fax) tbl_row += "Fax: <span>" + dealer.fax + "</span><br />";
  if (dealer.schedulePhone) tbl_row += "Serviço: <span>" + dealer.schedulePhone + "</span><br />";
  if (dealer.whatsAppPhone) tbl_row += "WhatsApp: <span>" + dealer.whatsAppPhone + "</span><br />";
  if (dealer.mainEmailAddress) tbl_row += "E-mail: <span>" + dealer.mainEmailAddress + "</span><br /><br />";

  tbl_row += "<span class='streetAddress'>";

  if (dealer.streetAddress) tbl_row += "" + dealer.streetAddress + " ";
  if (dealer.streetAddress2) tbl_row += "" + dealer.streetAddress2 + " <br>";
  if (dealer.streetAddress3) tbl_row += "" + dealer.streetAddress3 + " <br>";
  if (dealer.county) tbl_row += "" + dealer.county + ", ";
  if (dealer.city) tbl_row += "" + dealer.city + " - ";
  if (dealer.state) tbl_row += "" + dealer.state + " ";
  if (dealer.zipCode) tbl_row += "<br>" + dealer.zipCode + " ";

  tbl_row += '<a href="#" onclick=selDealer("dealer-' + dealer.csn + '") class="selecionar">Selecionar</a>';

  tbl_row += "</span></li>";

}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      console.log("Usuário rejeitou a solicitação de Geolocalização.");
      break;
    case error.POSITION_UNAVAILABLE:
      console.log("Localização indisponível.");
      break;
    case error.TIMEOUT:
      console.log("A requisição expirou.");
      break;
    case error.UNKNOWN_ERROR:
      console.log("Algum erro desconhecido aconteceu.");
      break;
  }
}

function buscaDealer(query, isgeo, lat, long) {
  tbl_row = "";
  $("#"+buscaDealerDOM.areaBusca+" .dealerResults").html("");
  $.ajax({
    type: 'POST',
    url: 'https://meuhyundai.com.br/API-PUBL/solicitar-requisicao.json',
    data: JSON.stringify({
      "chaveApp": "ebc7d90d928b4defc32e2aa51db7609b230fee6a51b344326a29c6d1671cee23",
      "origem": "AEM"
    }),
    success: function(response, textStatus, jQxhr) {
      if (response.status.code == 200) {
        const token = response.token;
        if ($("#servicos").prop("checked")) var servicos = "Y";
        else var servicos = "N";
        if ($("#showroom").prop("checked")) var showroom = "Y";
        else var showroom = "N";
        var maxKm = 75;
        if ($("#"+buscaDealerDOM.areaBusca+"_queryDealerMOS").data("raio") && parseInt($("#"+buscaDealerDOM.areaBusca+"_queryDealerMOS").data("raio"), 10) > 0) {
          maxKm = $("#"+buscaDealerDOM.areaBusca+"_queryDealerMOS").data("raio");
        }

        $.ajax({
          url: "https://meuhyundai.com.br/API-CONC/listar-concessionaria.json",
          dataType: "json",
          crossDomain: true,
          data: JSON.stringify({
            "chaveApp": "ebc7d90d928b4defc32e2aa51db7609b230fee6a51b344326a29c6d1671cee23",
            "dealer": query,
            "isGeoLocalizacao": isgeo,
            "latitude": lat,
            "longitude": long,
            "salesDealerFlag": "Y",
            "serviceDealerFlag": "Y",
            "maxKm": maxKm,
            "origem": "AEM",
            "authorization": "Bearer " + token
          }),
          cache: false,
          method: "POST",
          success: function(response, textStatus, jQxhr) {
            if (response.status.code == 200) {
              if (response.dealer.length > 0) {
                for (var i = 0; i < response.dealer.length; i++) {
                  makeHTML(response.dealer[i]);
                };

                $("#"+buscaDealerDOM.areaBusca+" .dealerResults").html(tbl_row);
              } else {
                $("#"+buscaDealerDOM.areaBusca+" .dealerResults").html("<i>Nenhuma concessionária encontrada</i>");
              }
              return false;
            } else {
              console.log(response);
              return false;
            }
          },
          error: function(jqXhr, textStatus, errorThrown) {
            console.log(errorThrown);
            return false;
          }
        });
      }
    },
    error: function(jqXhr, textStatus, errorThrown) {
      console.log(errorThrown);
      return false;
    }
  });
}

function initBuscaDealer(buscaID, dadosDealerID, idDealerID) {
  buscaDealerDOM.areaBusca = buscaID;
  buscaDealerDOM.areaResultado = dadosDealerID;
  buscaDealerDOM.campoIDDealer = idDealerID;
  criaBuscaDealer();
}

function criaBuscaDealer() {

  htmlBoxBuscaDealer = '<div class="box-concessionaria-monte" style="">' +
    '  <div class="titulo-concess">' +
    '    Concessionária' +
    '  </div>' +
    '  <div class="filter-search">' +
    '    <div class="form-area-escolha left">' +
    '      <input type="radio" value="1" name="tipoBusca" id="'+buscaDealerDOM.areaBusca+'_campo-radio2" onclick="getLocationMOS(this); " />' +
    '      <label class="m1" for="'+buscaDealerDOM.areaBusca+'_campo-radio2">' +
    '        Usar Minha Localização' +
    '      </label>' +
    '      <input type="radio" checked name="tipoBusca" value="concessionaria" id="'+buscaDealerDOM.areaBusca+'_tipoBuscaConcessionaria" />' +
    '      <label for="'+buscaDealerDOM.areaBusca+'_tipoBuscaConcessionaria" onclick="desativarAutoCompleteMonteoSeu()" class="t1">' +
    '        Busca por nome/cep' +
    '      </label>' +
    '      <input type="radio" name="tipoBusca" value="cidade" id="'+buscaDealerDOM.areaBusca+'_tipoBuscaCidade"/>' +
    '      <label for="'+buscaDealerDOM.areaBusca+'_tipoBuscaCidade" onclick="ativarAutoCompleteMonteoSeu()">' +
    '        Busca por localidade' +
    '      </label>' +
    '    </div>' +
    '  </div>' +
    '  <div class="pac-card" id="'+buscaDealerDOM.areaBusca+'_pac-cardMOS">' +
    '    <div class="form search" id="'+buscaDealerDOM.areaBusca+'_formSearchMOS">' +
    '      <div class="form-group" id="'+buscaDealerDOM.areaBusca+'_pac-containerMOS">' +
    '        <input type="text" id="'+buscaDealerDOM.areaBusca+'_queryDealerMOS" class="queryDealer form-control" data-raio="1000" placeholder="Digite sua busca" onkeypress="inputPress(this, event)" />' +
    '      </div>' +
    '    </div>' +
    '  </div>' +
    '  <div class="filter-search">' +
    '    <div class="form-area-escolha right">' +
    '    </div>' +
    '    <input type="submit" class="form-control" value="Buscar" onclick="buscaQuery()" />' +
    '  </div>' +
    '  <div class="resultado">' +
    '    <ul class="dealerResults"></ul>' +
    '  </div>' +
    '</div>';
  $("#" + buscaDealerDOM.areaBusca).html(htmlBoxBuscaDealer);
}

function selDealer(objId) {
  event.preventDefault();
  console.log($("#" + objId).html());
  $("#" + buscaDealerDOM.areaResultado).html($("#" + objId).html());
  $("#" + buscaDealerDOM.areaBusca + ' .box-concessionaria-monte').hide();
  $("#" + buscaDealerDOM.campoIDDealer).val(objId.replace("dealer-", ""));
  return false;
}
