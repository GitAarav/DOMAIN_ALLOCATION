const express = require('express');
const router = express.Router();

const Domain = require('../models/question');

router.post('/question', async (req, res) => {
    const { domainName, question } = req.body;

    const validDomains = ['management', 'design', 'web', 'ml', 'app', 'ece', 'iot', 'cp', 'mg'];
    if (!validDomains.includes(domainName)) {
        return res.status(400).send({ message: "Invalid domain name" });
    }

    const domainPrefixes = {
        management: 'mn',
        design: 'de',
        web: 'we',
        ml: 'ml',
        app: 'ap',
        ece: 'ec',
        iot: 'io',
        cp: 'cp',
        mg: 'mg'
    };

    try {
        let domain = await Domain.findOne({ domainName });

        if (!domain) {
            domain = new Domain({
                domainName,
                questions: [] 
            });
        }

        const prefix = domainPrefixes[domainName];
        const nextQuestionIndex = domain.questions.length > 0 
            ? Math.max(
                ...domain.questions
                    .map(q => q.questionNumber)
                    .filter(qn => qn.startsWith(prefix)) 
                    .map(qn => parseInt(qn.replace(prefix, ''), 10)) 
                    .filter(n => !isNaN(n)) 
            ) + 1 
            : 1;

        const nextQuestionNumber = `${prefix}${nextQuestionIndex}`;

        const newQuestion = {
            questionNumber: nextQuestionNumber,
            question
        };

        domain.questions.push(newQuestion);

        await domain.save();

        res.status(201).send({
            message: 'Question added successfully',
            success: true,
            data: newQuestion
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error adding question",
            success: false,
            error: error.message
        });
    }
});






router.get('/:domain/:questionNumber?', async (req, res) => {
    const { domain, questionNumber } = req.params;

    try {
        const foundDomain = await Domain.findOne({ domainName: domain });

        if (!foundDomain) {
            return res.status(404).send({
                message: 'Domain not found',
                
            });
        }

        if (questionNumber) {
            const prefix = domain.slice(0, 2); 
            const formattedQuestionNumber = `${prefix}${questionNumber}`;

            const foundQuestion = foundDomain.questions.find(
                q => q.questionNumber === formattedQuestionNumber
            );

             if (!foundQuestion) {
                return res.status(404).send({
                    message: "Question not found",
                });
            }

            return res.status(200).json({
                data: foundQuestion
            });
        }

        return res.status(200).json({
            data: foundDomain.questions
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "Error getting question",
            error: error.message
        });
    }
});


router.put('/:domainName/:questionNumber', async (req, res) => {
    const { domainName, questionNumber } = req.params; 
    const { newQuestion } = req.body;

    const domainPrefixes = {
        management: 'mn',
        design: 'de',
        web: 'we',
        ml: 'ml',
        app: 'ap',
        ece: 'ec',
        iot: 'io',
        cp: 'cp',
        mg: 'mg'
    };

    const prefix = domainPrefixes[domainName];

    if (!prefix) {
        return res.status(400).send({ message: "Invalid domain name" });
    }

    try {
        const domain = await Domain.findOne({ domainName });

        if (!domain) {
            return res.status(404).send({
                message: 'Domain not found',
            });
        }

        const questionId = `${prefix}${questionNumber}`;

        const question = domain.questions.find(q => q.questionNumber === questionId);

        if (!question) {
            return res.status(404).send({
                message: 'Question not found',
             
            });
        }

        if (!newQuestion) {
            return res.status(200).send({
                
                data: question
            });
        }

        question.question = newQuestion;

        await domain.save();

        res.status(200).send({
        
            data: question
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "Error updating question",
          
            error: error.message
        });
    }
});



router.delete('/:domainName/:questionNumber?', async (req, res) => {
    const { domainName, questionNumber } = req.params;

    const domainPrefixes = {
        management: 'mn',
        design: 'de',
        web: 'we',
        ml: 'ml',
        app: 'ap',
        ece: 'ec',
        iot: 'io',
        cp: 'cp',
        mg: 'mg'
    };

    const prefix = domainPrefixes[domainName];

    if (!prefix) {
        return res.status(400).send({ message: "Invalid domain name" });
    }

    try {
        const domain = await Domain.findOne({ domainName });

        if (!domain) {
            return res.status(404).send({
                message: 'Domain not found',
                success: false
            });
        }

        if (questionNumber) {
            const questionId = `${prefix}${questionNumber}`;
            const questionIndex = domain.questions.findIndex(q => q.questionNumber === questionId);

            if (questionIndex === -1) {
                return res.status(404).send({
                    message: 'Question not found',
                    success: false
                });
            }

            const deletedQuestion = domain.questions.splice(questionIndex, 1);
            await domain.save();

            return res.status(200).send({
                message: 'Question deleted successfully',
                success: true,
                data: deletedQuestion
            });
        } else {
            domain.questions = [];
            await domain.save();

            return res.status(200).send({
                message: `All questions deleted for domain: ${domainName}`,
                success: true
            });
        }
    } catch (error) {
        res.status(500).send({
            message: "Error deleting question(s)",
            success: false,
            error: error.message
        });
    }
});




module.exports = router;