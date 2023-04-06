const Employee = require('../model/Employee');

const getAllEmployee = async (req, res) => {
	const allEmployees = await Employee.find({});
	if (!allEmployees)
		return res.status(204).json({ message: 'No Employee found.' });
	res.json(allEmployees);
};

const createNewEmployee = async (req, res) => {
	const body = req.body;
	if (!body?.firstname || !body?.lastname) {
		return res
			.status(400)
			.json({ message: 'First and last name are required.' });
	}
	try {
		const newEmployee = await Employee.create({
			firstname: body.firstname,
			lastname: body.lastname,
		});
		res.status(201).json(newEmployee);
	} catch (err) {
		console.error(err);
	}
};

const updateEmployee = async (req, res) => {
	if (!req?.body?.id) {
		return res.status(400).json({ message: 'ID is required' });
	}
	const foundEmployee = await Employee.findOne({ _id: req.body.id }).exec();
	if (!foundEmployee) {
		return res
			.status(204)
			.json({ message: `Employee ID ${req.body.id} not found` });
	}
	if (req.body.lastname) foundEmployee.lastname = req.body.lastname;
	if (req.body.firstname) foundEmployee.firstname = req.body.firstname;
	const result = await foundEmployee.save();
	res.status(200).json(result);
};

const deleteEmployee = async (req, res) => {
	if (!req?.body?.id) {
		return res.status(400).json({ message: 'ID is required' });
	}
	const foundEmployee = await Employee.findOne({ _id: req.body.id }).exec();
	if (!foundEmployee) {
		return res
			.status(404)
			.json({ message: `Employee ID ${req.body.id} not found` });
	}
	const result = await Employee.deleteOne({ _id: req.body.id });
	res.json(result);
};

const getEmployee = async (req, res) => {
	if (!req?.params?.id) {
		return res.status(400).json({ message: 'ID is required' });
	}
	const foundEmployee = await Employee.findOne({ _id: req.params.id }).exec();
	if (!foundEmployee) {
		return res
			.status(404)
			.json({ message: `Employee ID ${req.params.id} not found` });
	}
	res.json(employee);
};

module.exports = {
	getAllEmployee,
	createNewEmployee,
	updateEmployee,
	deleteEmployee,
	getEmployee,
};
