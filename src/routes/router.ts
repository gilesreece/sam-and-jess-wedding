import {Request, Response, Router} from "express";
import {body, validationResult} from "express-validator";
import { sesClient } from "../utils/ses-client";
import { createAttendingEmail, createNotAttendingEmail} from "../utils/mail";

const router = Router();

router.post('/form/attending', [
        body('lead_guest_fullname').notEmpty().withMessage('Must supply fullname'),
        body('attending').matches('^(?:yes|no)$').withMessage('Attending must be yes or no'),
        body('lead_guest_menu_choice').matches('^(?:Vothonas|Vegetarian|Vegan)$'),
        body('email').isEmail().withMessage('Must be a valid email'),
        body('guest_quantity').optional(),
        body('guest_list').optional(),
        body('form_message_area').optional(),
        body('boat_party').matches('^(?:yes|no)$'),
        body('song_request').optional().isString()
    ],
    (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors);
            return res.status(400).json({ errors: errors.array() });
        }
        sesClient.send(createAttendingEmail(req.body)).then((success) => {
            res.status(200).send({ status: 200, message: 'Guest attending', fullname: req.body.lead_guest_fullname });
        }).catch((err) => {
            res.status(400).send({ status: 400, message: 'RSVP not sent, Please email info@mrandmrsallen.com with your response'});
        });
    });

router.post('/form/not-attending', [
        body('fullname').notEmpty().withMessage('Must supply fullname'),
        body('attending').matches('^(?:yes|no)$').withMessage('Attending must be yes or no')
    ],
    (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors);
            return res.status(400).json({ errors: errors.array() });
        }
        sesClient.send(createNotAttendingEmail(req.body)).then((success) => {
            res.status(200).send({ status: 200, message: 'Guest not attending', fullname: req.body.fullname });
        }).catch((err) => {
            res.status(400).send({ status: 400, message: 'RSVP not sent, Please email info@mrandmrsallen.com with your response'});
        });
        
    });

router.get('/not-attending', (req: Request, res: Response) => {
    res.status(200).render('not-attending');
});

router.get('/attending', (req: Request, res: Response) => {
    res.status(200).render('attending');
});

router.get('/error', (req: Request, res: Response) => {
    res.status(200).render('error');
});

router.all('*', function(req, res){
    res.redirect('/');
});

export { router as allRoutes };