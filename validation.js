
if (typeof isSendingForm == "undefined")
  var isSendingForm = false;

function initForm(formID) {
  fields = getFields(formID);
  for (var i = 0; i < fields.length; i++) {
    setValidation(fields[i], false);
    if ($(fields[i]).data("mask")) {
      setMask(fields[i]);
    }
  }
}

function beforeSubmit(formID) {
  fields = getFields(formID);
  var formValid = true;
  for (var i = 0; i < fields.length; i++) {
    fieldReturn = setValidation(fields[i], true);
    if (!fieldReturn) {
      formValid = false;
    }
  }
  if (formValid) {
    console.log("valido");
  } else {
    console.log("invalido");
  }
  return formValid;
}

function getFields(formID) {
  var fields = $("#" + formID).find("[data-validate]");
  return fields;
}

function setValidation(obj, validateNow) {
  fieldType = $(obj).data('type');
  var minlengthConf = 0;
  if (($(obj).data("required") == true) || $(obj).data('minlenght') > 1) {
    minlengthConf = ($(obj).data('minlenght') ? $(obj).data('minlenght') : 1);
  }
  switch (fieldType) {
    case 'text':
      if (validateNow) {
        validateTextField(obj, minlengthConf);
      }
      $(obj).on("blur", function() {
        validateTextField(obj, minlengthConf);
      });
      break;
    case 'email':
      if (validateNow) {
        validateEmail(obj);
      }
      $(obj).on("blur", function() {
        validateEmail(obj);
      });
      break;
    case 'password':
      if (validateNow) {
        validatePassword(obj, minlengthConf);
      }
      $(obj).on("blur", function() {
        validatePassword(obj, minlengthConf);
      });
      break;
    case 'cpf':
      if (validateNow) {
        validateCPF(obj);
      }
      $(obj).on("blur", function() {
        validateCPF(obj);
      });
      break;
    case 'cep':
      if (validateNow) {
        validateCEP(obj);
      }
      $(obj).on("blur", function() {
        validateCEP(obj);
      });
      break;
    case 'phone':
      if (validateNow) {
        validatePhone(obj);
      }
      $(obj).on("blur", function() {
        validatePhone(obj);
      });
    case 'mobile':
      if (validateNow) {
        validatePhone(obj);
      }
      $(obj).on("blur", function() {
        validatePhone(obj);
      });
    case 'phone-mobile':
      if (validateNow) {
        validatePhone(obj);
      }
      $(obj).on("blur", function() {
        validatePhone(obj);
      });
      break;
    case 'mobile':
      if (validateNow) {
        validatePhone(obj);
      }
      $(obj).on("blur", function() {
        validatePhone(obj);
      });
      break;
    case 'radiof':
      if (validateNow) {
        validateRadio(obj);
      }
      $(obj).on("blur", function() {
        validateRadio(obj);
      });
      break;
    case 'data':
      if (validateNow) {
        validateData(obj);
      }
      $(obj).on("blur", function() {
        validateData(obj);
      });
      break;
    default:
      console.log("Unknown datatype: " + fieldType);
      return false;
  }
}

function setMask(obj) {
  var maskpattern = $(obj).data("mask");
  if (maskpattern != "") {
    $(obj).on("keyup", function() {
      switch ($(obj).data("type")) {
        case "phone-mobile":
          maskPhone(obj, event);
          break;
        default:
          mask(maskpattern, obj, event);
      }
    });
  }
}
/*
TODO:
validation.js:69 Unknown datatype: select (nao vazio)
validation.js:69 Unknown datatype: number (Numero apenas)

Consertar validacao de radio
Mensagens configuráveis
*/

function validateTextField(obj, minlengthConf, returnOnly) {
  $(obj).parent().find("span.error").remove();
  var text = obj.value;
  var minlength = 1;
  if (minlengthConf) {
    minlength = parseInt(minlengthConf);
  }
  if (text.length < minlength) {
    if (!returnOnly) {
      $(obj).parent().append("<span class='error'>Preencha o campo corretamente.</span>");
    }

    return false;
  }
  return true;
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

function maskPhone(obj, event) {
  var maskpattern = "(##) ####-####";
  var cursor = obj.selectionStart;
  text = obj.value.replace(/\D/g, '');

  //XXX: Mobile phone in Brazil (XX) 9 XXXX-XXXX
  if (text.substr(2, 1) == 9) {
    maskpattern = "(##) # ####-####";
  }

  mask(maskpattern, obj, event);
}

function validateData(obj) {
  $(obj).parent().find("span.error").remove();
  data = obj.value;

  //XXX: Convert Brazilian date format to US date format
  databr = data.split("/");
  data = databr[1] + "/" + databr[0] + "/" + databr[2];

  d = new Date(data);
  if (d.getDate() == databr[0]) {
    return true;
  } else {
    obj.value = "";
    $(obj).parent().append("<span class='error'>Data inválida, preencha novamente.</span>");
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

function validatePassword(obj, minlengthConf) {
  $(obj).parent().find("span.error").remove();
  console.log(minlengthConf);
  if (validateTextField(obj, minlengthConf, true)) {
      rules = {
        lowercase: true,
        uppercase: false,
        numbers: true,
        symbols: false
    };
    if (!passwordValidator(obj.value, rules)) {
      $(obj).parent().append("<span class='error'>Senha inválida, preencha novamente.</span>");
      return false;
    }
    return true;
  }
  $(obj).parent().append("<span class='error'>Senha deve ter no mínimo "+minlengthConf+" caracteres.</span>");
  return false;
}

function passwordValidator(pass, rules) {
  var lowercase = rules.lowercase;
  var uppercase = rules.uppercase;
  var numbers = rules.numbers;
  var symbols = rules.symbols;

  var format;
  console.log(pass);
  if (lowercase) {
    console.log("lowercase");
    format = /[a-z]/;
    if (!format.test(pass)) {
      return false;
    }
  }

  if (uppercase) {
    console.log("uppercase");
    format = /[A-Z]/;
    if (!format.test(pass)) {
      return false;
    }
  }

  if (numbers) {
    console.log("numbers");
    format = /[\d]/;
    if (!format.test(pass)) {
      return false;
    }
  }

  if (symbols) {
    console.log("symbols");
    format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (!format.test(pass)) {
      return false;
    }
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
  //XXX: Forked from https://github.com/FlavioALeal/MascaraJS
  //XXX: Obrigado, Flavio!
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
  //XXX: Brazilian Natural Persons Register validator
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
