<template>
    <div class="wrapper">
        <header>Поиск клиента</header>

        <form @submit.prevent>
            <label>email: <input v-model="email" type="text"> </label>
            <label>number: <input v-model="number" type="tel" v-mask="'##-##-##'"> </label>
            <input @click="send" type="submit" value="Найти">      
        </form>

        <footer class="info">
            <span class="load" v-if="status === 'load'">Загрузка...</span>
            <span class="error" v-else-if="status === 'error'">{{ result }}</span>
            <div class="result" v-else-if="status === 'success' && Array.isArray(result)">
                <span v-if="result.length === 0">Ничего не найдено</span>
                <div class="client" v-else v-for="client of result">
                    <span>email: {{ client.email }}</span>
                    <span>number: {{ client.number }}</span>
                </div>
            </div>
        </footer>
    </div>
</template>

<script>
    import {mask} from 'vue-the-mask';

    export default {
        name: 'App',
        directives: {mask},
        data() {
            return {
                email: '',
                number: '',
                result: '',
                abortController: null,
                status: ''
            }
        },
        methods: {
            validate() {
                const emailValidationPattern  = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
                const numberValidationPattern = /^\d+$/;

                if (!this.email.match(emailValidationPattern)) 
                    return 'Неправильный email';

                if (this.number && (this.numberWithoutMask.length !== 6 || !this.numberWithoutMask.match(numberValidationPattern))) 
                    return 'Неправильный номер';
            },

            async fetch(email, number) {
                const path = 'http://localhost:5000/search';
                this.abortController = new AbortController();

                const response = await fetch(
                    path + `?email=${email}${number ? `&number=${number}` : ''}`, 
                    { signal: this.abortController.signal }
                );
                return response.json();
                
            },
             
            async send() {
                if (this.abortController) this.abortController.abort();

                const validateResult = this.validate();
                if (validateResult) {
                    this.status = 'error';
                    this.result = validateResult;
                    return;
                }

                try {
                    this.status = 'load';
                    const response = await this.fetch(this.email, this.numberWithoutMask);
                    this.status = 'success';
                    this.result = response;
                } catch (e) {
                    if (e.name === 'AbortError') return;
                    this.status = 'error';
                    this.result = `Произошла ошибка при загрузке: (${e})`;
                } 
            }
        },
        computed: {
            numberWithoutMask() {
                return this.number.replaceAll('-', '');
            }
        }
    };
</script>

<style>
    body {
        background: #1a1a1a;
    }
    body * {
        display: block;
    }
    #app {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        flex-direction: column;
    }

    .wrapper {
        width: 40vw;
        font-size: 2.3em;
        padding: 1em;
        border: 1px solid white;
        background: aliceblue;
        > * {
            margin-top: 1em;
        }
    }

    header {
        text-align: center;
    }
    form {
        & input {
            width: 100%;
            font-size: 1em;
        }
        > input {
            margin-top: 1.2em; 
            height: 2em;
        }
    }
    
    .info {
        width: 100%;
        > * {width: 100%;}
        .result {
            border-top: 1px solid green;
            .client {
                background: rgba(0,0,0,.1);    
                border-bottom: 1px solid rgba(0,0,0,.2);
            }
        }
        .error { border-top: 1px solid red;}
        .load { border-top: 1px solid grey;}
    }
    
</style>