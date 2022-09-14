var apiUrl = ''

$(document).ready(function() {

    let attending = false;

    $('input[type=radio][name=attending]').on('change', function() {
        const mainForm = $('#person-attending-div');
        switch ($(this).val()) {
            case 'yes':
                attending = true;
                mainForm.empty().append(yesForm);
                break;
            case 'no':
                attending = false;
                mainForm.empty().append(noForm);
                break;
        }
        $('#guest-quantity').change(function() {
            var guestsValue = $(this).val();
            var fields = $('#guest-list');
            fields.empty();
            for (let i = 1; i <= guestsValue; i++) {
                fields.append(addNewInput(i));
            }
        });
    })
    var formElement = $('#form-to-send');

    var formAttending = {
        rules: {
            attending: {
                required: true
            },
            lead_guest_fullname: {
                required: true
            },
            lead_guest_menu_choice: {
                required: true
            },
            email: {
                required: true,
                email: true
            },
            guest_quantity: {
                required: true,
                number: true,
                min: 0,
                max: 6
            },
            guest_list: {
                required: false
            },
            form_message_area: {
                required: false
            },
            boat_party: {
                required: true
            },
            song_request: {
                required: false
            },
        }
    }

    formElement.validate({
        submitHandler: function (form, event) {
            event.preventDefault();
            console.log(formElement.serialize());
            if(attending === true) {
                $.post({
                    url: '/form/attending',
                    type: 'POST',
                    data: formElement.serialize(),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                }).done((data) => {
                   window.location = '/attending?name=' + data.fullname
                }).fail((error) => {
                    console.log(error);
                    window.location = '/error';
                });

            } else {
                $.post({
                    url: '/form/not-attending',
                    type: 'POST',
                    data: formElement.serialize(),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).done((data) =>{
                    window.location = '/not-attending?name=' + data.fullname
                }).fail((error) => {
                    console.log(error);
                    window.location = '/error';
                });
            }
        }
    });
});


function addNewInput(guestNumber) {
    return `
        <div class="row mb-4">
            <div class="col-md-12">
                <label>Guest ${guestNumber} fullname</label>
                <div class="input-group">
                    <input type="text" name="guest_list[${guestNumber}][fullname]" placeholder="Guest ${guestNumber} fullname" required class="form-control" aria-label="fullname">
                </div>
                <label>Guest ${guestNumber} menu choice</label>
                <div class="row">
                    <div class="col-md-4">
                        <div class="input-group-text pb-0">
                            <label>
                                <input checked type="radio" name="guest_list[${guestNumber}][menu_choice]" value="Vothonas" required> Vothonas
                            </label>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="input-group-text pb-0">
                            <label>
                                <input type="radio" name="guest_list[${guestNumber}][menu_choice]" value="Vegetarian" required> Vegetarian
                            </label>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="input-group-text pb-0">
                            <label>
                                <input type="radio" name="guest_list[${guestNumber}][menu_choice]" value="Vegan" required> Vegan
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    `
}

const yesForm = `
    <div class="row mb-4">
        <div class="col-md-12">
            <label for="form-full-name">Lead guest Full name</label>
            <input type="text" id="form-full-name" name="lead_guest_fullname" class="form-control" 
                placeholder="John Doe" required>
        </div>
    </div>
    <div class="row mb-4">
        <div class="col-md-12">
            <label>Lead Guest Menu choice</label>
            <div class="row">
                <div class="col-md-4">
                    <div class="input-group-text pb-0">
                        <label>
                            <input checked type="radio" name="lead_guest_menu_choice" value="Vothonas" required> Vothonas
                        </label>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="input-group-text pb-0">
                        <label>
                            <input type="radio" name="lead_guest_menu_choice" value="Vegetarian" required> Vegetarian
                        </label>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="input-group-text pb-0">
                        <label>
                            <input type="radio" name="lead_guest_menu_choice" value="Vegan" required> Vegan
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row mb-4">
        <div class="col-md-12">
            <label for="form-email">Email</label>
            <input type="text" id="form-email" class="form-control" name="email" placeholder="example@mrandmrsallen.com" required>
        </div>
    </div>
    <div class="row mb-4">
        <div class="col-md-12">
            <label for="guest-quantity">Guests (excluding you, Leave blank for no extra guests)</label>
            <select name="guest_quantity" id="guest-quantity" class="form-control"
                    aria-label="Default Guest option" >
                <option selected value=""></option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
            </select>
        </div>
    </div>
    <div id="guest-list"></div>
    <div class="row mb-4">
        <div class="col-md-12">
            <div class="form-group">
                <label for="form-message-area">Message (Include dietary requirements)</label>
                <textarea name="form_message_area" id="form-message-area" rows="5" class="form-control"
                          placeholder="Message"></textarea>
            </div>
        </div>
    </div>
    <div class="row mb-4">
        <div class="col-md-12">
            <label>Interested in Boat party?</label>
            <div class="form-group" id="form-boat-party">
                <div class="form-check-inline">
                    <input type="radio" class="form-check-input" name="boat_party" value="yes" required>
                    <label class="form-check-label">yes</label>
                </div>
                <div class="form-check-inline">
                    <input type="radio" class="form-check-input" name="boat_party" value="no" checked required>
                    <label class="form-check-label">no</label>
                </div>
            </div>
        </div>
    </div>
    <div class="row mb-4">
        <div class="col-md-12">
            <label for="form-song-request">What song do you want to dance to?</label>
            <input type="text" id="form-song-request" name="song_request" class="form-control">
        </div>
    </div>
`
const noForm = `
<div class="row mb-4 aos-animate">
    <div class="col-md-12">
        <label for="form-full-name">Full name</label>
        <input type="text" id="form-full-name" class="form-control" name="fullname" placeholder="John Doe" required>
    </div>
</div>
`