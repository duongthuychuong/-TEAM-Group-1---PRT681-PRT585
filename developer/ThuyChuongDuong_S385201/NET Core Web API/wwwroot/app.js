const { createApp } = Vue;

createApp({
    data() {
        return {
            tasks: [],
            form: {
                title: '',
                description: ''
            },
            filter: 'all',
            filters: [
                { label: 'All', value: 'all' },
                { label: 'Active', value: 'active' },
                { label: 'Completed', value: 'completed' }
            ],
            loading: true,
            saving: false,
            error: '',
            busyIds: new Set()
        };
    },

    computed: {
        today() {
            return new Intl.DateTimeFormat(undefined, {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
            }).format(new Date());
        },

        remainingCount() {
            return this.tasks.filter(task => !task.isCompleted).length;
        },

        filteredTasks() {
            if (this.filter === 'active') {
                return this.tasks.filter(task => !task.isCompleted);
            }

            if (this.filter === 'completed') {
                return this.tasks.filter(task => task.isCompleted);
            }

            return this.tasks;
        },

        emptyMessage() {
            if (this.filter === 'completed') {
                return { title: 'Nothing completed yet', body: 'Finish a task and it will show up here.' };
            }

            if (this.filter === 'active') {
                return { title: 'You are all caught up', body: 'There are no active tasks right now.' };
            }

            return { title: 'A fresh start', body: 'Add your first task above and take it one step at a time.' };
        }
    },

    mounted() {
        this.loadTasks();
    },

    methods: {
        async apiRequest(url, options = {}) {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            if (!response.ok) {
                let message = 'Something went wrong. Please try again.';

                try {
                    const problem = await response.json();
                    message = problem.message || problem.title || message;
                } catch {
                    // The fallback message is used for responses without JSON.
                }

                throw new Error(message);
            }

            return response.status === 204 ? null : response.json();
        },

        async loadTasks() {
            this.loading = true;
            this.error = '';

            try {
                this.tasks = await this.apiRequest('/api/tasks');
            } catch (error) {
                this.error = error.message;
            } finally {
                this.loading = false;
            }
        },

        async addTask() {
            if (!this.form.title || this.saving) {
                return;
            }

            this.saving = true;
            this.error = '';

            try {
                const task = await this.apiRequest('/api/tasks', {
                    method: 'POST',
                    body: JSON.stringify(this.form)
                });
                this.tasks.unshift(task);
                this.form = { title: '', description: '' };
                this.filter = 'all';
            } catch (error) {
                this.error = error.message;
            } finally {
                this.saving = false;
            }
        },

        async toggleTask(task, isCompleted) {
            const previousValue = task.isCompleted;
            task.isCompleted = isCompleted;
            this.busyIds.add(task.id);
            this.error = '';

            try {
                const updatedTask = await this.apiRequest(`/api/tasks/${task.id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        title: task.title,
                        description: task.description,
                        isCompleted
                    })
                });
                Object.assign(task, updatedTask);
            } catch (error) {
                task.isCompleted = previousValue;
                this.error = error.message;
            } finally {
                this.busyIds.delete(task.id);
            }
        },

        async deleteTask(task) {
            if (!window.confirm(`Delete “${task.title}”?`)) {
                return;
            }

            this.busyIds.add(task.id);
            this.error = '';

            try {
                await this.apiRequest(`/api/tasks/${task.id}`, { method: 'DELETE' });
                this.tasks = this.tasks.filter(item => item.id !== task.id);
            } catch (error) {
                this.error = error.message;
            } finally {
                this.busyIds.delete(task.id);
            }
        },

        formatDate(date) {
            if (!date) {
                return 'just now';
            }

            return new Intl.DateTimeFormat(undefined, {
                day: 'numeric',
                month: 'short'
            }).format(new Date(date));
        }
    }
}).mount('#app');
