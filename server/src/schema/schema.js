const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLEnumType } = require('graphql');
const Project = require('../models/project');
const Client = require('../models/client');

//Project Type
const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        client: {
            type: ClientType,
            resolve(parent, _) {
                return Client.findById(parent.clientId);
            }
        }
    })
});

//Client Type
const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString }
    })
});

//Root Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        projects: {
            type: new GraphQLList(ProjectType),
            resolve() {
                return Project.find();
            }
        },
        project: {
            type: ProjectType,
            args: { id: { type: GraphQLID } },
            resolve(_, args) {
                return Project.findById(args.id);
            }
        },
        clients: {
            type: new GraphQLList(ClientType),
            resolve() {
                return Client.find();
            }
        },
        client: {
            type: ClientType,
            args: { id: { type: GraphQLID } },
            resolve(_, args) {
                return Client.findById(args.id);
            }
        }
    }
});

//Mutations
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        //Add Client
        addClient: {
            type: ClientType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                phone: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(_, args) {
                const client = new Client({
                    name: args.name,
                    email: args.email,
                    phone: args.phone
                });
                return client.save();
            }
        },
        //Delete Client
        deleteClient: {
            type: ClientType,
            args: { id: { type: new GraphQLNonNull(GraphQLID) } },
            resolve(_, args) {
                return Client.findByIdAndRemove(args.id);
            }
        },
        //Add Project
        addProject: {
            type: ProjectType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                description: { type: new GraphQLNonNull(GraphQLString) },
                status: {
                    type: new GraphQLEnumType({
                        name: 'ProjectStatus',
                        values: {
                            'new': { value: 'Inactive' },
                            'progress': { value: 'Inprogress' },
                            'done': { value: 'Completed' }
                        }
                    }),
                    defaultValue: 'Inactive'
                },
                clientId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(_, args) {
                const project = new Project({
                    name: args.name,
                    description: args.description,
                    status: args.status,
                    clientId: args.clientId
                });
                return project.save();
            }
        },
        // Delete Project
        deleteProject: {
            type: ProjectType,
            args: { id: { type: new GraphQLNonNull(GraphQLID) } },
            resolve(_, args) {
                return Project.findByIdAndRemove(args.id);
            }
        },
        //Update Project
        updateProject: {
            type: ProjectType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                status: {
                    type: new GraphQLEnumType({
                        name: 'ProjectStatusUpdate',
                        values: {
                            'new': { value: 'Inactive' },
                            'progress': { value: 'Inprogress' },
                            'done': { value: 'Completed' }
                        }
                    })
                }
            },
            resolve(_, args) {
                return Project.findByIdAndUpdate(args.id, {
                    $set: {
                        name: args.name,
                        description: args.description,
                        status: args.status
                    }
                }, { new: true });
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});