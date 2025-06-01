const express = require('express');
const router = express.Router();
const model = require('../../../model');


router.get(process.env.BASE_URL + '/api/v1/rest/post',
    async function (req, resp){
        let data = null;
        const Post = await model.Post.schema('public');
        data = await Post.findAll();
        resp.json(data).status(200);
});

router.get(process.env.BASE_URL + '/api/v1/rest/post/:id',
    async function (req, resp){
        let data = null;
        const id = req.params.id;
        const Post = await model.Post.schema('public');
        data = await Post.findByPk(id);
		if(data === null){
			resp.json({"resposta": "Nenhum post encontrado!"}).status(200);	
		}
        resp.json(data).status(200);
});

router.post(process.env.BASE_URL + '/api/v1/rest/post',
    async function (req, resp){
	    const Post = await model.Post.schema('public');
        const data = req.body;
        try {
            console.log(data.post);
            result = await Post.create(data);
            return resp.status(201).send({success: true, msg: 'Post criado com sucesso!'});
        } catch (err) {
            return resp.status(500).send({error: err});
        }
});

router.put(
	process.env.BASE_URL + '/api/v1/rest/post/:id',
	async function (req, resp) {
		const id = req.params.id;
		const Post = await model.Post.schema('public');
		const data = await Post.findByPk(id);
		const antigo = {...data.dataValues};
		if (!data) {
			return resp.status(404).send({error: 'Não encontrado'});
		}
		try {
			let novo = await data.update(req.body);
			return resp.status(200).send({success: true, msg: `Post ${data.title} alterado com sucesso`});
		} catch (e) {
			return resp.status(500).send({error: e});
		}
	},
);

router.delete(
	process.env.BASE_URL + '/api/v1/rest/post/:id',
	async function (req, resp) {
		const id = req.params.id;
		const Post = await model.Post.schema('public');
		const data = await Post.findByPk(id);
        const reply = await model.reply.schema('public');
		if (!data) {
			return resp.status(404).send({error: 'Não encontrado'});
		}
		try {
			const antigo = {...data.dataValues};
            await reply.destroy({
                where: {
                    id_post: id
                },
            });
			await data.destroy();
			return resp.send({success: true, msg: `Post ${antigo.title} deletado com sucesso!`});
		} catch (error) {
            console.log(error);
			return resp.status(500).send({error});
		}
	},
);

module.exports = router;
