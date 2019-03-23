<template>
<div class="modal fade show" id="myModal" style="display: block;">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title"><slot name="modal-header"></slot></h4>
                <button type="button" class="close" @click="$emit('close')" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true" >×</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-12">
                        <h4>Calls History</h4>
                    </div>
                    <div v-if="showCalls()" class="col-12">
                        <table class="table">
                            <thead class="thead-dark">
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Sent/Received</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Duration</th>
                                </tr>
                            </thead>
                            <tbody>
                                <slot name="call-register"></slot>
                            </tbody>                            
                        </table>
                    </div>
                    <div v-else class="col-12">
                        There is no calls registered
                    </div>

                    <div class="col-12">
                        <h4>SMS History</h4>
                    </div>
                    <div v-if="showSms()" class="col-12">
                        <table class="table">
                            <thead class="thead-dark">
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Sent/Received</th>
                                    <th scope="col">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                <slot name="sms-register"></slot>
                            </tbody>                            
                        </table>
                    </div>
                    <div v-else class="col-12">
                        There is no SMS registered
                    </div>
                </div>

                <slot name="modal-text"></slot>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger" @click="$emit('close')" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
</template>

<script>
    export default {
        name: "ModalHistory",
        methods:{
            showCalls(){
                return this.$parent.showModalCallsReg;
            },
            showSms(){
                return this.$parent.showModalSmsReg;
            }
        }
    }
</script>