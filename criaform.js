// ler api e passar template, receber id do container e imprimir o form
function buscaCampos(urlApi, containerID) {
  $.ajax({
    type: 'GET',
    url: urlApi,
    success: function(response, textStatus, jQxhr) {
      if (response.status.code == 200) {
        for (var i = 0; i < response.templateCampos.length; i++) {
          campo = templateCampos = response.templateCampos[i];
          if (campo.display) {
            nomeCampo = getKeyByValue(camposAPI, campo.templateCampo.campo);
            $("#"+containerID).append(camposHTML[nomeCampo].replace(/IDFORM_campo/g, containerID+"_"+nomeCampo));
          }
        };
        validaForm(containerID);
      }},
    error: function(jqXhr, textStatus, errorThrown) {
      console.log(errorThrown);
      return false;
    }
  });
}


// function getKeyByValue(object, value) {
//   return Object.keys(object).find(key => object[key] === value);
// }

function getKeyByValue(object, value) {
  for (var prop in object) {
    if (object.hasOwnProperty(prop)) {
      if (object[prop] === value)
        return prop;
    }
  }
}



var camposAPI = {
  cep : 'CEP',
  nome : 'NOME',
  sobrenome : 'SOBRENOME',
  cpf : 'CPF',
  sexo : 'SEXO',
  nasc : 'DATA_NASCIMENTO',
  timefutebol : 'TIME_FUTEBOL',
  filhos : 'QTDE_FILHOS',
  endereco : 'ENDEREÇO',
  numero : 'NÚMERO',
  complemento : 'COMPLEMENTO',
  complementocheck : 'SEM_COMPLEMENTO',
  bairro : 'BAIRRO',
  cidade : 'CIDADE',
  estado : 'ESTADO',
  telres : 'TELEFONE_RESIDENCIAL',
  telcom : 'TELEFONE_COMERCIAL',
  telcel : 'TELEFONE_CELULAR',
  email : 'EMAIL',
  senha : 'SENHA',
  resenha : 'SENHA_CONFIRMAR',
  checkinsms : 'ACEITO_CELULAR',
  checkinemail : 'ACEITO_EMAIL'
}


var camposHTML = {
cep : '<div class="form-group col1">'+
        '<label for="IDFORM_campo">Digite o CEP, cidade, sigla do estado ou nome de uma concessionária*</label>'+
        '<input id="IDFORM_campo" type="text" data-validate="true" data-type="cep" data-required="true" data-mask="##.###-###" class="form-control" />'+
      '</div>',

nome : '<div class="form-group col2">'+
        '<label for="IDFORM_campo">Nome*</label>'+
        '<input id="IDFORM_campo" type="text" data-validate="true" data-type="text" data-required="true" data-minlenght="3" class="form-control" />'+
      '</div>',

sobrenome : '<div class="form-group col2">'+
        '<label for="IDFORM_campo">Sobrenome*</label>'+
        '<input id="IDFORM_campo" type="text" data-validate="true" data-type="text" data-required="true" data-minlenght="3" class="form-control" />'+
      '</div>',

cpf : '<div class="form-group col1">'+
        '<label for="IDFORM_campo">CPF*</label>'+
        '<input id="IDFORM_campo" type="tel" data-validate="true" data-type="cpf" data-required="true" data-mask="###.###.###-##" class="form-control" />'+
      '</div>',

sexo : '<div class="form-group col2">'+
        '<label for="IDFORM_campo">Sexo*</label>'+
        '<input type="radio" name="sexo" id="IDFORM_campo_sexo-f" value="Feminino" data-validate="true" data-type="radio" data-required="true">'+
        '<input type="radio" name="sexo" id="IDFORM_campo_sexo-m" value="Masculino" data-validate="true" data-type="radio" data-required="true">'+
      '</div>',

nasc : '<div class="form-group col2">'+
        '<label for="IDFORM_campo">Data de nascimento*</label>'+
        '<input id="IDFORM_campo" type="text" data-validate="true" data-type="data" data-required="true" data-mask="##/##/####" class="form-control" />'+
      '</div>',

timefutebol : '<div class="form-group col2">'+
        '<label for="IDFORM_campo">Time de futebol</label>'+
        '<select id="IDFORM_campo" data-validate="true" data-type="select" data-required="false" class="form-control">'+
          '<option value="" selected disabled>Selecione</option>'+
          '<option value="Santos">Santos</option>'+
          '<option value="SaoPaulo">São Paulo</option>'+
        '</select>'+
      '</div>',

filhos : '<div class="form-group col2">'+
        '<label for="IDFORM_campo">Quantidade de Filhos*</label>'+
        '<input id="IDFORM_campo" type="number" data-validate="true" data-type="number" data-required="false" data-minlenght="1" value="0" class="form-control" />'+
      '</div>',

endereco : '<div class="form-group col2">'+
        '<label for="IDFORM_campo">Endereço*</label>'+
        '<input id="IDFORM_campo" type="text" data-validate="true" data-type="text" data-required="true" data-minlenght="5" class="form-control" />'+
      '</div>',


numero : '<div class="form-group col2">'+
        '<label for="IDFORM_campo">Número*</label>'+
        '<input id="IDFORM_campo" type="text" data-validate="true" data-type="text" data-required="true" data-minlenght="1" class="form-control" />'+
      '</div>',

complemento : '<div class="form-group col2">'+
        '<label for="IDFORM_campo">Complemento*</label>'+
        '<input id="IDFORM_campo" type="text" data-validate="true" data-type="text" data-required="false" data-minlenght="0" class="form-control" />'+
      '</div>',

complementocheck : '<div class="form-group col2">'+
        '<input id="IDFORM_campo" type="checkbox" name="sem_complemento" value="true">'+
        '<label for="IDFORM_campo">Não possuo complemento</label>'+
      '</div>',

bairro : '<div class="form-group col2">'+
        '<label for="IDFORM_campo">Bairro*</label>'+
        '<input id="IDFORM_campo" type="text" data-validate="true" data-type="text" data-required="true" data-minlenght="2" class="form-control" />'+
      '</div>',


cidade : '<div class="form-group col2">'+
        '<label for="IDFORM_campo">Cidade*</label>'+
        '<input id="IDFORM_campo" type="text" data-validate="true" data-type="text" data-required="true" data-minlenght="2" class="form-control" />'+
      '</div>',

estado : '<div class="form-group col1">'+
        '<label for="IDFORM_campo">Estado*</label>'+
        '<select id="IDFORM_campo" data-validate="true" data-type="text" data-required="true" data-minlenght="5" class="form-control">'+

        '</select>'+
      '</div>',

telres : '<div class="form-group col3">'+
        '<label for="IDFORM_campo">Telefone Residencial*</label>'+
        '<input id="IDFORM_campo" type="tel" data-validate="true" data-type="phone" data-required="true" data-mask="(##) ####-####" class="form-control tel" placeholder="0000-0000" />'+
      '</div>',

telcom : '<div class="form-group col3">'+
        '<label for="IDFORM_campo">Telefone Comercial*</label>'+
        '<input id="IDFORM_campo" type="tel" data-validate="true" data-type="phone-mobile" data-required="true" data-mask="phone-mobile" class="form-control tel" placeholder="0000-0000" />'+
      '</div>',

telcel : '<div class="form-group col3">'+
        '<label for="IDFORM_campo">Telefone Celular*</label>'+
        '<input id="IDFORM_campo" type="tel" data-validate="true" data-type="mobile" data-required="true" data-mask="(##) ####-#####" class="form-control tel" placeholder="0000-0000" />'+
      '</div>',

email : '<div class="form-group col1">'+
        '<label for="IDFORM_campo">E-mail*</label>'+
        '<input id="IDFORM_campo" type="text" data-validate="true" data-type="email" data-required="true" class="form-control" />'+
      '</div>',

senha : '<div class="form-group col2">'+
        '<label for="IDFORM_campo">Senha*</label>'+
        '<input id="IDFORM_campo" type="password" data-validate="true" data-type="password" data-required="true" data-minlenght="5" class="form-control" />'+
      '</div>',

resenha : '<div class="form-group col2">'+
        '<label for="IDFORM_campo">Confirmar Senha*</label>'+
        '<input id="IDFORM_campo" type="password" data-validate="true" data-type="password" data-required="true" data-minlenght="5" class="form-control" />'+
      '</div>',

checkinsms : '<div class="form-group col2">'+
        '<input id="IDFORM_campo" type="checkbox" name="aceito_celular" value="true">'+
        '<label for="IDFORM_campo">Aceito receber mensagens no celular</label>'+
      '</div>',

checkinemail : '<div class="form-group col2">'+
        '<input id="IDFORM_campo" type="checkbox" name="aceito_email" value="true">'+
        '<label for="IDFORM_campo">Aceito receber mensagens por e-mail</label>'+
      '</div>',

submit : '<div class="form-group col1">'+
        '<input id="IDFORM_campo" type="submit" name="enviar" class="bt" value="Enviar" />'+
      '</div>',
};
