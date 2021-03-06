import { Router } from 'express';
import { getRepository } from 'typeorm';
import { connection } from '../../util/typeorm-connection';
import { Only } from '../../middleware';
import { Child, Illustrations } from '../../database/entity';

const illustrationRoutes = Router();

illustrationRoutes.get('/', Only(Child), async (req, res) => {
    try {
        const { illustrations } = req.user as Child;
        return res.json({ illustrations });
    } catch (err) {
        return res
            .status(500)
            .json({ message: 'Hmm... That did not work, please try again later.' });
    }
});

illustrationRoutes.get('/:week', Only(Child), async (req, res) => {
    try {
        const { illustrations } = req.user as Child;
        const illustration = illustrations.find(({ week }) => week === parseInt(req.params.week));
        if (!illustration) throw Error('404');
        return res.json({ illustration });
    } catch (err) {
        if (err.toString() === 'Error: 404')
            return res.status(404).json({ message: `Submission not found` });
        else
            return res
                .status(500)
                .json({ message: 'Hmm... That did not work, please try again later.' });
    }
});

illustrationRoutes.post('/', Only(Child), async (req, res) => {
    try {
        const { illustration } = res.locals.body as Illustrations;

        const { cohort, illustrations } = req.user as Child;
        const { week } = cohort;

        if (illustrations.find((e) => e.week === week)) throw Error('400');

        try {
            const { child, ...illustrations } = await getRepository(
                Illustrations,
                connection()
            ).save({
                week,
                illustration,
                votes: 0,
                child: req.user,
            });

            return res.status(201).json({ illustrations });
        } catch (err) {
            console.log(err.toString());
            return res.status(500).json({ message: err.toString() });
        }
    } catch (err) {
        if (err.toString() === 'Error: 400')
            return res.status(400).json({ message: `Illustration already exists` });
        else
            return res
                .status(500)
                .json({ message: 'Hmm... That did not work, please try again later.' });
    }
});

illustrationRoutes.delete('/:week', Only(Child), async (req, res) => {
    try {
        const reqWeek = parseInt(req.params.week);

        const { illustrations } = req.user as Child;
        const illustration = illustrations.find(({ week }) => week === reqWeek);
        if (!illustration) throw Error('404');
        const { affected } = await getRepository(Illustrations, connection()).delete({
            childId: req.user.id,
            week: reqWeek,
        });
        if (!affected) throw Error();
        return res.json({ illustration });
    } catch (err) {
        if (err.toString() === 'Error: 404')
            return res.status(404).json({ message: `Illustration not found` });
        else res.status(500).json({ message: 'Hmm... That did not work, please try again later.' });
    }
});

export { illustrationRoutes };
