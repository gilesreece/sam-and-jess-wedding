var apiUrl = ''

$(document).ready(function() {
    $('#form-guest-number').change(function() {
        var guestsValue = $(this).val();
        var fields = $('#form-extra-guests');
        fields.empty();
        for (let i = 1; i <= guestsValue; i++) {
            fields.append(addNewInput(i));
        }
    });

    $('#form-to-send').validate({
        rules: {
            'form-full-name': "required",
            'form-email': {
                email: true,
                required: true
            },
            'form-guest-number': {
                max: 6
            }
        },
        submitHandler: function (form) {
            $.ajax({
                url: 'https://api.sendgrid.com/v3/mail/send',
                type: 'POST',
                data: {

                },
                headers: {
                    Authorization: `Bearer ${apiUrl}`
                }
            })
        }
    });
});

function addNewInput(guestNumber) {
    return `
        <div class="form-group">
            <label for="form-full-name-${guestNumber}">Guest ${guestNumber} Fullname</label>
            <input type="text" id="form-full-name-${guestNumber}" class="form-control" 
                placeholder="Guest ${guestNumber}" required>
        </div>
    `
}
