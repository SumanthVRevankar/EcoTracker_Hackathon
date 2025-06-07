import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      'nav.calculator': 'Calculator',
      'nav.weather': 'Weather & AQI',
      'nav.community': 'Community',
      'nav.leaderboard': 'Leaderboard',
      'nav.profile': 'Profile',
      'nav.challenges': 'Challenges',
      'nav.insights': 'Insights',
      'nav.signin': 'Sign In',
      'nav.signup': 'Sign Up',
      'nav.logout': 'Logout',
      
      // Home page
      'home.title': 'Track Your Carbon Footprint',
      'home.subtitle': 'Join the movement towards sustainable living. Monitor your environmental impact, connect with like-minded individuals, and make a positive difference for our planet.',
      'home.getStarted': 'Get Started Free',
      'home.startCalculating': 'Start Calculating',
      
      // Calculator
      'calc.title': 'Carbon Footprint Calculator',
      'calc.subtitle': 'Calculate your daily carbon emissions and environmental impact',
      'calc.personalInfo': 'Personal Information',
      'calc.lifestyle': 'Lifestyle & Diet',
      'calc.transportation': 'Transportation',
      'calc.homeEnergy': 'Home & Energy',
      'calc.consumption': 'Consumption & Waste',
      'calc.calculate': 'Calculate My Carbon Footprint',
      'calc.calculating': 'Calculating Your Carbon Footprint...',
      
      // Results
      'result.title': 'Your Carbon Footprint',
      'result.perDay': 'per day',
      'result.monthlyImpact': 'Monthly Impact',
      'result.yearlyImpact': 'Yearly Impact',
      'result.recommendations': 'Recommendations to Reduce Your Footprint:',
      'result.calculateAgain': 'Calculate Again',
      
      // Community
      'community.title': 'Community Forum',
      'community.subtitle': 'Connect with eco-conscious individuals and share sustainable living tips',
      'community.createPost': 'Create New Post',
      'community.shareThoughts': 'Share Your Thoughts',
      'community.postTitle': 'Post title...',
      'community.postContent': "What's on your mind about sustainability?",
      
      // Challenges
      'challenges.title': 'Eco Challenges',
      'challenges.subtitle': 'Complete daily and weekly challenges to reduce your environmental impact',
      'challenges.daily': 'Daily Challenges',
      'challenges.weekly': 'Weekly Challenges',
      'challenges.completed': 'Completed',
      'challenges.inProgress': 'In Progress',
      'challenges.streak': 'Day Streak',
      
      // Insights
      'insights.title': 'AI Insights & Recommendations',
      'insights.subtitle': 'Personalized tips and analysis based on your carbon footprint data',
      'insights.personalizedTips': 'Personalized Tips',
      'insights.trendAnalysis': 'Trend Analysis',
      'insights.goals': 'Recommended Goals',
      
      // Common
      'common.loading': 'Loading...',
      'common.error': 'An error occurred',
      'common.save': 'Save',
      'common.cancel': 'Cancel',
      'common.delete': 'Delete',
      'common.edit': 'Edit',
      'common.share': 'Share',
      'common.export': 'Export',
      'common.download': 'Download'
    }
  },
  es: {
    translation: {
      // Navigation
      'nav.calculator': 'Calculadora',
      'nav.weather': 'Clima y Calidad del Aire',
      'nav.community': 'Comunidad',
      'nav.leaderboard': 'Clasificación',
      'nav.profile': 'Perfil',
      'nav.challenges': 'Desafíos',
      'nav.insights': 'Perspectivas',
      'nav.signin': 'Iniciar Sesión',
      'nav.signup': 'Registrarse',
      'nav.logout': 'Cerrar Sesión',
      
      // Home page
      'home.title': 'Rastrea Tu Huella de Carbono',
      'home.subtitle': 'Únete al movimiento hacia una vida sostenible. Monitorea tu impacto ambiental, conéctate con personas afines y marca una diferencia positiva para nuestro planeta.',
      'home.getStarted': 'Comenzar Gratis',
      'home.startCalculating': 'Comenzar a Calcular',
      
      // Calculator
      'calc.title': 'Calculadora de Huella de Carbono',
      'calc.subtitle': 'Calcula tus emisiones diarias de carbono e impacto ambiental',
      'calc.personalInfo': 'Información Personal',
      'calc.lifestyle': 'Estilo de Vida y Dieta',
      'calc.transportation': 'Transporte',
      'calc.homeEnergy': 'Hogar y Energía',
      'calc.consumption': 'Consumo y Residuos',
      'calc.calculate': 'Calcular Mi Huella de Carbono',
      'calc.calculating': 'Calculando Tu Huella de Carbono...',
      
      // Results
      'result.title': 'Tu Huella de Carbono',
      'result.perDay': 'por día',
      'result.monthlyImpact': 'Impacto Mensual',
      'result.yearlyImpact': 'Impacto Anual',
      'result.recommendations': 'Recomendaciones para Reducir Tu Huella:',
      'result.calculateAgain': 'Calcular de Nuevo',
      
      // Community
      'community.title': 'Foro de la Comunidad',
      'community.subtitle': 'Conéctate con personas conscientes del medio ambiente y comparte consejos de vida sostenible',
      'community.createPost': 'Crear Nueva Publicación',
      'community.shareThoughts': 'Comparte Tus Pensamientos',
      'community.postTitle': 'Título de la publicación...',
      'community.postContent': '¿Qué piensas sobre la sostenibilidad?',
      
      // Challenges
      'challenges.title': 'Desafíos Ecológicos',
      'challenges.subtitle': 'Completa desafíos diarios y semanales para reducir tu impacto ambiental',
      'challenges.daily': 'Desafíos Diarios',
      'challenges.weekly': 'Desafíos Semanales',
      'challenges.completed': 'Completado',
      'challenges.inProgress': 'En Progreso',
      'challenges.streak': 'Días Consecutivos',
      
      // Insights
      'insights.title': 'Perspectivas y Recomendaciones de IA',
      'insights.subtitle': 'Consejos personalizados y análisis basados en los datos de tu huella de carbono',
      'insights.personalizedTips': 'Consejos Personalizados',
      'insights.trendAnalysis': 'Análisis de Tendencias',
      'insights.goals': 'Objetivos Recomendados',
      
      // Common
      'common.loading': 'Cargando...',
      'common.error': 'Ocurrió un error',
      'common.save': 'Guardar',
      'common.cancel': 'Cancelar',
      'common.delete': 'Eliminar',
      'common.edit': 'Editar',
      'common.share': 'Compartir',
      'common.export': 'Exportar',
      'common.download': 'Descargar'
    }
  },
  fr: {
    translation: {
      // Navigation
      'nav.calculator': 'Calculatrice',
      'nav.weather': 'Météo et Qualité de l\'Air',
      'nav.community': 'Communauté',
      'nav.leaderboard': 'Classement',
      'nav.profile': 'Profil',
      'nav.challenges': 'Défis',
      'nav.insights': 'Analyses',
      'nav.signin': 'Se Connecter',
      'nav.signup': 'S\'Inscrire',
      'nav.logout': 'Se Déconnecter',
      
      // Home page
      'home.title': 'Suivez Votre Empreinte Carbone',
      'home.subtitle': 'Rejoignez le mouvement vers une vie durable. Surveillez votre impact environnemental, connectez-vous avec des personnes partageant les mêmes idées et faites une différence positive pour notre planète.',
      'home.getStarted': 'Commencer Gratuitement',
      'home.startCalculating': 'Commencer à Calculer',
      
      // Calculator
      'calc.title': 'Calculatrice d\'Empreinte Carbone',
      'calc.subtitle': 'Calculez vos émissions quotidiennes de carbone et votre impact environnemental',
      'calc.personalInfo': 'Informations Personnelles',
      'calc.lifestyle': 'Mode de Vie et Alimentation',
      'calc.transportation': 'Transport',
      'calc.homeEnergy': 'Maison et Énergie',
      'calc.consumption': 'Consommation et Déchets',
      'calc.calculate': 'Calculer Mon Empreinte Carbone',
      'calc.calculating': 'Calcul de Votre Empreinte Carbone...',
      
      // Results
      'result.title': 'Votre Empreinte Carbone',
      'result.perDay': 'par jour',
      'result.monthlyImpact': 'Impact Mensuel',
      'result.yearlyImpact': 'Impact Annuel',
      'result.recommendations': 'Recommandations pour Réduire Votre Empreinte:',
      'result.calculateAgain': 'Calculer à Nouveau',
      
      // Community
      'community.title': 'Forum Communautaire',
      'community.subtitle': 'Connectez-vous avec des personnes soucieuses de l\'environnement et partagez des conseils de vie durable',
      'community.createPost': 'Créer un Nouveau Post',
      'community.shareThoughts': 'Partagez Vos Pensées',
      'community.postTitle': 'Titre du post...',
      'community.postContent': 'Que pensez-vous de la durabilité?',
      
      // Challenges
      'challenges.title': 'Défis Écologiques',
      'challenges.subtitle': 'Relevez des défis quotidiens et hebdomadaires pour réduire votre impact environnemental',
      'challenges.daily': 'Défis Quotidiens',
      'challenges.weekly': 'Défis Hebdomadaires',
      'challenges.completed': 'Terminé',
      'challenges.inProgress': 'En Cours',
      'challenges.streak': 'Jours Consécutifs',
      
      // Insights
      'insights.title': 'Analyses et Recommandations IA',
      'insights.subtitle': 'Conseils personnalisés et analyses basés sur vos données d\'empreinte carbone',
      'insights.personalizedTips': 'Conseils Personnalisés',
      'insights.trendAnalysis': 'Analyse des Tendances',
      'insights.goals': 'Objectifs Recommandés',
      
      // Common
      'common.loading': 'Chargement...',
      'common.error': 'Une erreur s\'est produite',
      'common.save': 'Sauvegarder',
      'common.cancel': 'Annuler',
      'common.delete': 'Supprimer',
      'common.edit': 'Modifier',
      'common.share': 'Partager',
      'common.export': 'Exporter',
      'common.download': 'Télécharger'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;