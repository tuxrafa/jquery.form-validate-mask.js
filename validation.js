if (typeof isSendingForm == "undefined")
  var isSendingForm = false;

function initForm(formID) {
  fields = getFields(formID);
  for (var i = 0; i < fields.length; i++) {
    setValidation(fields[i]);
    if ($(fields[i]).data("mask")) {
      setMask(fields[i]);
    }
  }
}

function getFields(formID) {
  var fields = $("#"+ formID).find("[data-validate]");
  return fields;
}

function setMask(obj) {
  var maskpattern = $(obj).data("mask");
  if (maskpattern != "") {
    $(obj).on("keyup", function () {
      mask(maskpattern, obj, event);
    });
  }
}

function setValidation(obj) {
  fieldType = $(obj).data('type');
  switch (fieldType) {
    case 'text':
      var minlengthConf = ($(obj).data('minlenght') ? $(obj).data('minlenght') : 1);
      $(obj).on("blur", function () {
        validateTextField(obj, minlengthConf);
      });
      break;
    case 'email':
      $(obj).on("blur", function () {
        validateEmail(obj);
      });
      break;
    case 'cpf':
      $(obj).on("blur", function () {
        validateCPF(obj);
      });
      break;
    case 'cep':
      $(obj).on("blur", function () {
        validateCEP(obj);
      });
      break;
    case 'phone':
      $(obj).on("blur", function () {
        validatePhone(obj);
      });
      break;
    case 'mobile':
      $(obj).on("blur", function () {
        validatePhone(obj);
      });
      break;
    case 'radio':
      $(obj).on("blur", function () {
        validateRadio(obj);
      });
      break;
    default:
      console.log("Unknown datatype: " + fieldType);
      return false;
  }
}

function validateRadio(objName, container) {
  $("#" + container + " span.error").remove();
  if ($("#" + container + " [name=" + objName + "]:checked").val() != undefined) {
    return true;
  }
  $("#" + container).append("<span class='error'>Por favor, informe o " + objName + ".</span>");
  return false;
}

function radioInvalid() {
  var radioInvalid = false;

  if (!validateRadio("motivo", "contatoMotivo")) {
    radioInvalid = true;
  }

  if (!validateRadio("sexo", "contatoSexo")) {
    radioInvalid = true;
  }
  return radioInvalid;
}

function validateCPF(obj) {
  $(obj).parent().find("span.error").remove();
  if (!validatorCPF(obj.value)) {
    obj.value = "";
    $(obj).parent().append("<span class='error'>CPF inválido, preencha novamente.</span>");
    return false;
  }
  return true;
}

function validateCEP(obj) {
  $(obj).parent().find("span.error").remove();
  cep = obj.value;
  cep = cep.replace(/\D/g, '');
  regex = /^(\d)\1+$/;
  if (cep.length < 8 || (regex.test(cep))) {
    obj.value = "";
    $(obj).parent().append("<span class='error'>CEP inválido, preencha novamente.</span>");
    return false;
  }
}

function validatePhone(obj) {
  $(obj).parent().find("span.error").remove();
  numTel = obj.value;
  numTel = numTel.replace(/\D/g, '');
  regex = /^(\d)\1+$/;
  if (numTel.length < 10 || (regex.test(numTel))) {
    obj.value = "";
    $(obj).parent().append("<span class='error'>Telefone inválido, preencha novamente.</span>");
    return false;
  }
}

function validateEmail(obj) {
  $(obj).parent().find("span.error").remove();
  email = obj.value;
  regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  if (!regex.test(email)) {
    $(obj).val("");
    $(obj).parent().append("<span class='error'>E-mail inválido, preencha novamente.</span>");
    return false;
  }
  return true;
}

function validateTextField(obj, minlengthConf) {
  $(obj).parent().find("span.error").remove();
  var text = obj.value;
  var minlength = 1;
  if (minlengthConf) {
    minlength = parseInt(minlengthConf);
  }
  if (text.length < minlength) {
    $(obj).parent().append("<span class='error'>Preencha o campo corretamente.</span>");
    return false;
  }
  return true;
}

function processingForm() {
  isSendingForm = true;
  $(".formContato .botao-enviar").attr('disabled');
  $(".formContato .botao-enviar").css({
    'cursor': 'wait'
  });
  $(".formContato .botao-enviar").css({
    'pointer-events': 'none'
  });
  $(document.body).css({
    'cursor': 'wait'
  });
}

function formSent() {
  sendingForm = false;
  $(".formContato .botao-enviar").removeAttr('disabled', 'disabled');
  $(".formContato .botao-enviar").css({
    'cursor': 'default'
  });
  $(".formContato .botao-enviar").css({
    'pointer-events': 'all'
  });
  $(document.body).css({
    'cursor': 'default'
  });
}

function mask(m, t, e) {
  // Forked from https://github.com/FlavioALeal/MascaraJS
  // Obrigado, Flavio!
  var cursor = t.selectionStart;
  var text = t.value;
  text = text.replace(/\D/g, '');
  var l = text.length;
  var lm = m.length;
  if (window.event) {
    id = e.keyCode;
  } else if (e.which) {
    id = e.which;
  }
  fixedCursor = false;
  if (cursor < l) fixedCursor = true;
  var freedCursor = false;
  if (id == 16 || id == 19 || (id >= 33 && id <= 40)) freedCursor = true;
  ii = 0;
  mm = 0;
  if (!freedCursor) {
    if (id != 8) {
      t.value = "";
      j = 0;
      for (i = 0; i < lm; i++) {
        if (m.substr(i, 1) == "#") {
          t.value += text.substr(j, 1);
          j++;
        } else if (m.substr(i, 1) != "#") {
          t.value += m.substr(i, 1);
        }
        if (id != 8 && !fixedCursor) cursor++;
        if ((j) == l + 1) break;

      }
    }
  }
  if (fixedCursor && !freedCursor) cursor--;
  t.setSelectionRange(cursor, cursor);
}

function validatorCPF(strCPF) {
  // Brazilian Natural Persons Register validator
  strCPF = strCPF.replace(/\D/g, '');
  var Soma;
  var Resto;
  Soma = 0;

  regex = /^(\d)\1+$/;

  if (strCPF.length != 11 || (regex.test(strCPF))) return false;

  for (i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
  Resto = (Soma * 10) % 11;

  if ((Resto == 10) || (Resto == 11)) Resto = 0;
  if (Resto != parseInt(strCPF.substring(9, 10))) return false;

  Soma = 0;
  for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
  Resto = (Soma * 10) % 11;

  if ((Resto == 10) || (Resto == 11)) Resto = 0;
  if (Resto != parseInt(strCPF.substring(10, 11))) return false;
  return true;
}
