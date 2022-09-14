import {SendEmailCommand} from "@aws-sdk/client-ses";

const TO_ADDRESS = "info@mrandmrsallen.com";
// const TO_ADDRESS = "me@reecegiles.com";

interface emailMessageYes {
    attending: string,
    lead_guest_fullname: string,
    lead_guest_menu_choice: string,
    email: string,
    guest_quantity: number,
    guest_list?: [
        { fullname: string, menu_choice: string }
    ],
    form_message_area: string,
    boat_party: string,
    song_request: string,
}

interface emailMessageNo {
    attending: string
    fullname: string
}

const createAttendingEmail = (body: emailMessageYes): SendEmailCommand => {
    let allGuests = ``;

    if(body.guest_list) {
        let counter = 1;
        for (const guest of body.guest_list) {
            allGuests += `Guest ${counter} Fullname: ${guest.fullname}\n\t`
            allGuests += `Guest ${counter} Menu Choice: ${guest.menu_choice}\n\n`
            counter++;
        }
    }
    
    return emailTemplate(`
        Lead Guest name: ${body.lead_guest_fullname}
        Attending: ${body.attending}
        Lead Guest email: ${body.email}
        Lead Guest Menu Choice: ${body.lead_guest_menu_choice}
        
        Total extra guests: ${body.guest_quantity}
        
        ${allGuests}
        
        Message:
        ${body.form_message_area}
        
        Boat Party: ${body.boat_party}
        
        Song Request: ${body.song_request}
    `);
}

const createNotAttendingEmail = (body: emailMessageNo): SendEmailCommand => {

    return emailTemplate(`
        Lead Guest name: ${body.fullname}
        Attending: ${body.attending}
    `);
}

const emailTemplate = (message: string) => {
    return new SendEmailCommand({
        Destination: { CcAddresses: [], ToAddresses: [ TO_ADDRESS ] },
        Message: {
            Body: {
                Text: {
                    Charset: "UTF-8",
                    Data: `
                        ${message}
                        
                        _______
                        
                        Sent from www.mrandmrsallen.com
                    `,
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: "Wedding RSVP"
            },
        },
        Source: TO_ADDRESS,
        ReplyToAddresses: [],
    });
}

export { createAttendingEmail, createNotAttendingEmail};