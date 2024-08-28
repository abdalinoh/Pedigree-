import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosSetup';
import { Container, Row, Col, Table, Button, Alert, Spinner } from 'react-bootstrap';
import moment from 'moment';
import useLinkTypes from '../hooks/useLinkTypes';
import { useAuth } from '../context/AuthContext'; // Importez votre contexte d'authentification

const MemberDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate(); // Pour la navigation
    const [member, setMember] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { linkTypes, loading: linkTypesLoading, error: linkTypesError } = useLinkTypes();
    
    const { role } = useAuth(); // Récupérez les informations de l'utilisateur
    const isAdmin = role === 'ADMIN'; // Déterminez si l'utilisateur est un administrateur

    useEffect(() => {
        const fetchMemberDetails = async () => {
            try {
                setLoading(true);
                const endpoint = isAdmin 
                    ? `/admin/member/details/${id}` 
                    : `/user/member/details/${id}`;
                const response = await axiosInstance.get(endpoint);
                setMember(response.data.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des détails du membre', error);
                setError('Erreur lors de la récupération des détails du membre.');
            } finally {
                setLoading(false);
            }
        };

        fetchMemberDetails();
    }, [id, isAdmin]);

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" />
                <p>Chargement des détails du membre...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="text-center mt-5">
                <Alert variant="danger">
                    {error}
                </Alert>
                <Button variant="primary" onClick={() => navigate('/members-list')}>
                    Retour à la liste des membres
                </Button>
            </Container>
        );
    }

    if (!member) {
        return (
            <Container className="text-center mt-5">
                <Alert variant="warning">
                    Membre non trouvé.
                </Alert>
                <Button variant="primary" onClick={() => navigate('/members-list')}>
                    Retour à la liste des membres
                </Button>
            </Container>
        );
    }

    if (linkTypesLoading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" />
                <p>Chargement des types de lien...</p>
            </Container>
        );
    }

    if (linkTypesError) {
        return (
            <Container className="text-center mt-5">
                <Alert variant="danger">
                    {linkTypesError}
                </Alert>
            </Container>
        );
    }

    const getLinkTypeDescription = (type) => {
        const typeObj = linkTypes.find(linkType => linkType.id === type);
        return typeObj ? typeObj.description : 'Non spécifié';
    };

    return (
        <Container className="mt-4">
            <Row>
                <Col>
                    <h2>Détails du membre</h2>
                    <Table striped bordered hover responsive>
                        <tbody>
                            <tr>
                                <th>Nom</th>
                                <td>{member.nom || 'Non spécifié'}</td>
                            </tr>
                            <tr>
                                <th>Prénom</th>
                                <td>{member.prenom || 'Non spécifié'}</td>
                            </tr>
                            <tr>
                                <th>Date de naissance</th>
                                <td>{member.date_de_naissance ? moment(member.date_de_naissance).format('DD/MM/YYYY') : 'Non spécifié'}</td>
                            </tr>
                            <tr>
                                <th>Sexe</th>
                                <td>{member.sexe || 'Non spécifié'}</td>
                            </tr>
                            <tr>
                                <th>État matrimonial</th>
                                <td>{member.statut_matrimonial || 'Non spécifié'}</td>
                            </tr>
                            <tr>
                                <th>Type de lien</th>
                                <td>{member.type_de_lien ? getLinkTypeDescription(member.type_de_lien) : 'Non spécifié'}</td>
                            </tr>
                            <tr>
                                <th>Père</th>
                                <td>{member.id_pere && member.pere ? `${member.pere.prenom} ${member.pere.nom}` : 'Non spécifié'}</td>
                            </tr>
                            <tr>
                                <th>Mère</th>
                                <td>{member.id_mere && member.mere ? `${member.mere.prenom} ${member.mere.nom}` : 'Non spécifié'}</td>
                            </tr>
                            <tr>
                                <th>Conjoint</th>
                                <td>{member.conjoint || 'Non spécifié'}</td>
                            </tr>
                            <tr>
                                <th>Profession</th>
                                <td>{member.profession || 'Non spécifié'}</td>
                            </tr>
                            <tr>
                                <th>Religion</th>
                                <td>{member.religion || 'Non spécifié'}</td>
                            </tr>
                        </tbody>
                    </Table>
                    <Button variant="primary" onClick={() => navigate(-1)}>Retour</Button>
                </Col>
            </Row>
        </Container>
    );
};

export default MemberDetail;