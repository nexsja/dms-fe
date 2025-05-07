import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import("@/views/HomeView.vue"),
        meta: {
            title: 'Home',
            description: 'Welcome to the PDF Marker App. Here you can upload and annotate your PDF documents.',
            icon: 'pi pi-home'
        }
    },
    {
        path: '/login',
        name: 'login',
        component: () => import("@/views/user/Login.vue"),
    },
    {
        path: '/profile',
        name: 'profile',
        component: () => import("@/views/user/Profile.vue"),
    },
    {
        path: '/documents',
        meta: {
            title: 'Documents',
            description: 'View and manage your uploaded documents.',
            icon: 'pi pi-folder'
        },
        children: [
            {
                path: '',
                name: 'document',
                component: () => import('@/views/document/TableView.vue'),
            },
            {
                path: ':id',
                name: 'document-viewer',
                component: () => import('@/views/document/OneDocument.vue'),
                props: route => ({ documentId: route.params.id }),
            }
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: () => import('@/views/NotFoundView.vue'),
        meta: {
            title: '404 Not Found',
            description: 'The page you are looking for does not exist.',
            icon: 'pi pi-exclamation-triangle'
        }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes: routes
});

router.beforeEach((to, from, next) => {
    document.title = to.meta.title ? `${to.meta.title} - PDF Marker App` : 'PDF Marker App'
    next()
})

export const appRouter = router;