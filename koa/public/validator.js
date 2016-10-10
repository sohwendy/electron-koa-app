$(document).ready(

  $('#device-form').form({
    inline: true,
    on: 'change',
    verbose: true,
    fields: {
      name: {
        identifier: 'name',
        rules: [
          {
            type: 'empty',
            prompt: 'Please enter your device name'
          }
        ]
      },
      brand: {
        identifier: 'brand',
        rules: [
          {
            type: 'empty',
            prompt: 'Please select your device brand'
          }
        ]
      },
      model: {
        identifier: 'model',
        rules: [
          {
            type: 'empty',
            prompt: 'Please enter your device model'
          }
        ]
      },
      os: {
        identifier: 'os',
        rules: [
          {
            type: 'checked',
            prompt: 'Please choose your device operating system'
          }
        ]
      },
      users: {
        identifier: 'users',
        rules: [
          {
            type: 'minCount[1]',
            prompt: 'Please select at least 1 user'
          }
        ]
      },
      date: {
        identifier: 'date',
        rules: [
          {
            type: 'empty',
            prompt: 'Please select your date of purchase'
          }
        ]
      }
    }
  })
);

$('.ui.dropdown').dropdown();
$('.ui.checkbox').checkbox();

$('input[name="date"]').daterangepicker(
  {
    locale: {
      format: 'DD MMM YYYY'
    },
    singleDatePicker: true,
    autoUpdateInput: false
  }
);

$('input[name="date"]').on('apply.daterangepicker', function(ev, picker) {
  $(this).val(picker.startDate.format('DD MMM YYYY'));
});

$('#field-photo').on('change', function(e) {

  if (e.target.value) {
    filename = e.target.value.split('\\').pop();
    $('#photo-name').html(filename);
  }
});